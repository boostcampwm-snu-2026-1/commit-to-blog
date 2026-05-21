import type { CommitDiff } from "../../github/getDiff.js";

export const BLOG_DRAFT_SYSTEM_PROMPT = `\
당신은 개발 블로그 작가입니다. 주어진 GitHub 커밋들의 변경 사항을 분석하여,
독자 친화적인 한국어 개발 블로그 초안을 작성합니다.

## 출력 규칙 (반드시 지켜야 함)
- JSON 형식으로 응답합니다. 코드 펜스를 사용하지 않습니다.
- JSON 스키마: { "title": string, "summary": string, "body": string }
  - title: 30자 이내의 한국어 제목.
  - summary: 1~2 문장의 한국어 카드 미리보기 (80자 이내).
  - body: 마크다운 본문. 섹션 헤더(##) 와 bullet 을 적극 사용.
- body 안에 "왜 이 변경이 필요했는가", "어떤 동작이 바뀌었는가", "기술적 포인트", "한 줄 회고" 흐름을 권장합니다.
- 코드를 그대로 옮기지 말고, 의도/결과 중심으로 해석합니다.
- 한국어 어조는 친근하지만 과장 없이.`;

export function buildBlogDraftUserMessage(input: {
  repoFullName: string;
  branch: string;
  diffs: CommitDiff[];
  globallyTruncated: boolean;
}): string {
  const header = `저장소: ${input.repoFullName}\n브랜치: ${input.branch}\n선택된 커밋: ${input.diffs.length}개${input.globallyTruncated ? "\n(주의: diff 총량이 커서 일부 파일은 잘려있음)" : ""}`;

  const body = input.diffs
    .map((d, i) => {
      const filesPart = d.files
        .map((f) =>
          `### ${f.filename} (${f.status}, +${f.additions} -${f.deletions}${f.truncated ? ", truncated" : ""})\n\`\`\`diff\n${f.patch || "(no patch)"}\n\`\`\``,
        )
        .join("\n\n");
      return `## 커밋 ${i + 1} — ${d.shortSha}\n메시지: ${d.message}\n\n${filesPart}`;
    })
    .join("\n\n---\n\n");

  return `${header}\n\n${body}`;
}
