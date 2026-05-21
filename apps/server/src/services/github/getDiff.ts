import { hasGithubToken } from "../../config/env.js";
import { githubRest } from "./client.js";

const MAX_PATCH_PER_FILE = 8 * 1024; // 8KB
const MAX_TOTAL_PATCH = 32 * 1024; // 32KB
const MOCK_DIFF_PLACEHOLDER = `\
// (mock) GITHUB_TOKEN이 없어 diff를 가져올 수 없습니다.
// 아래 값은 LLM 요약 파이프라인 확인용 더미 텍스트입니다.
- 이전 상태: 세션 만료 30분
+ 변경 상태: 세션 만료 2시간
+ 추가: 비정상 종료 시 무결성 체크
`;

export type FileDiff = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string;
  truncated: boolean;
};

export type CommitDiff = {
  sha: string;
  shortSha: string;
  message: string;
  files: FileDiff[];
};

/**
 * 커밋 1개의 변경 사항을 가져온다.
 * 토큰이 없거나 호출 실패 시 mock placeholder.
 */
export async function getCommitDiff(
  owner: string,
  repo: string,
  sha: string,
): Promise<CommitDiff> {
  if (!hasGithubToken()) {
    return {
      sha,
      shortSha: sha.slice(0, 7),
      message: "(mock) 커밋 메시지를 가져올 수 없습니다.",
      files: [
        {
          filename: "(mock) example.ts",
          status: "modified",
          additions: 3,
          deletions: 1,
          patch: MOCK_DIFF_PLACEHOLDER,
          truncated: false,
        },
      ],
    };
  }

  const rest = githubRest();
  const res = await rest.repos.getCommit({ owner, repo, ref: sha });

  const message = res.data.commit.message.split("\n", 1)[0] ?? "";
  const files = (res.data.files ?? []).map<FileDiff>((f) => {
    const patch = f.patch ?? "";
    const truncated = patch.length > MAX_PATCH_PER_FILE;
    return {
      filename: f.filename,
      status: f.status ?? "modified",
      additions: f.additions ?? 0,
      deletions: f.deletions ?? 0,
      patch: truncated ? `${patch.slice(0, MAX_PATCH_PER_FILE)}\n…(truncated)` : patch,
      truncated,
    };
  });

  return {
    sha: res.data.sha,
    shortSha: res.data.sha.slice(0, 7),
    message,
    files,
  };
}

/**
 * 여러 커밋 diff 를 LLM 입력으로 묶을 때, 총 patch 길이가 MAX_TOTAL_PATCH를 넘으면
 * 뒤쪽 파일부터 잘라낸다. 잘라낸 사실은 truncated 표시로 반환.
 */
export function squashDiffsForLlm(diffs: CommitDiff[]): {
  diffs: CommitDiff[];
  totalPatchChars: number;
  globallyTruncated: boolean;
} {
  let total = 0;
  let globallyTruncated = false;
  const out: CommitDiff[] = [];

  for (const d of diffs) {
    const trimmedFiles: FileDiff[] = [];
    for (const f of d.files) {
      if (total + f.patch.length > MAX_TOTAL_PATCH) {
        globallyTruncated = true;
        trimmedFiles.push({
          ...f,
          patch: "…(omitted to fit token budget)",
          truncated: true,
        });
        total = MAX_TOTAL_PATCH;
        continue;
      }
      total += f.patch.length;
      trimmedFiles.push(f);
    }
    out.push({ ...d, files: trimmedFiles });
  }

  return { diffs: out, totalPatchChars: total, globallyTruncated };
}
