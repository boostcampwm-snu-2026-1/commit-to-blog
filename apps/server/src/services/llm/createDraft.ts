import type { Draft } from "@commit-to-blog/shared";
import { env, hasGithubToken, hasOpenAiKey } from "../../config/env.js";
import { ApiError } from "../../lib/ApiError.js";
import { LruCache } from "../../lib/lruCache.js";
import { makeContextKey } from "../../lib/makeContextKey.js";
import { getCommitDiff, squashDiffsForLlm } from "../github/getDiff.js";
import {
  BLOG_DRAFT_SYSTEM_PROMPT,
  buildBlogDraftUserMessage,
} from "./prompts/blogDraft.js";
import { openai } from "./client.js";

const draftCache = new LruCache<string, Draft>(50);

export type CreateDraftInput = {
  repoFullName: string;
  branch: string;
  commitShas: string[];
};

function parseRepoFullName(fullName: string): [string, string] {
  const [owner, repo] = fullName.split("/", 2);
  if (!owner || !repo) {
    throw ApiError.badRequest(
      `repoFullName 형식이 잘못되었습니다: ${fullName}`,
    );
  }
  return [owner, repo];
}

function buildFallbackDraft(input: CreateDraftInput, contextKey: string): Draft {
  const title = "(mock) 자동 생성된 블로그 초안";
  return {
    contextKey,
    repoFullName: input.repoFullName,
    branch: input.branch,
    commitShas: input.commitShas,
    title,
    summary:
      "OPENAI_API_KEY가 설정되지 않아 더미 응답을 반환합니다. 실제 키를 .env에 넣으면 LLM 호출로 대체됩니다.",
    body: `# ${title}\n\n## 변경 사항 요약\n선택된 커밋 ${input.commitShas.length}개의 변경 사항을 정리할 자리입니다.\n\n## 동작 변화\n- 이 본문은 LLM 미연결 상태의 자리 표시자입니다.\n\n## 한 줄 회고\n실제 LLM 호출은 OPENAI_API_KEY 설정 후 자동으로 활성화됩니다.`,
    generatedAt: new Date().toISOString(),
    model: `${env.OPENAI_MODEL} (mock)`,
  };
}

type ChatJsonShape = { title: string; summary: string; body: string };

function tryParseDraftJson(raw: string): ChatJsonShape | null {
  // 코드 펜스가 섞여있어도 best-effort 로 JSON 만 추출.
  const trimmed = raw.trim();
  const candidate = trimmed.startsWith("{")
    ? trimmed
    : (trimmed.match(/\{[\s\S]*\}/)?.[0] ?? "");
  if (!candidate) return null;
  try {
    const parsed = JSON.parse(candidate);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.title === "string" &&
      typeof parsed.summary === "string" &&
      typeof parsed.body === "string"
    ) {
      return parsed as ChatJsonShape;
    }
    return null;
  } catch {
    return null;
  }
}

export async function createDraft(input: CreateDraftInput): Promise<Draft> {
  const contextKey = makeContextKey({
    repoFullName: input.repoFullName,
    branch: input.branch,
    commitShas: input.commitShas,
    model: env.OPENAI_MODEL,
  });

  const cached = draftCache.get(contextKey);
  if (cached) return cached;

  // diff 수집 (실패해도 LLM 호출은 계속할 수 있도록 best-effort)
  const [owner, repo] = parseRepoFullName(input.repoFullName);
  const rawDiffs = await Promise.all(
    input.commitShas.map((sha) => getCommitDiff(owner, repo, sha)),
  );
  const { diffs, globallyTruncated } = squashDiffsForLlm(rawDiffs);

  if (!hasOpenAiKey()) {
    const fallback = buildFallbackDraft(input, contextKey);
    draftCache.set(contextKey, fallback);
    return fallback;
  }

  let parsed: ChatJsonShape | null = null;
  try {
    const completion = await openai().chat.completions.create({
      model: env.OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: BLOG_DRAFT_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildBlogDraftUserMessage({
            repoFullName: input.repoFullName,
            branch: input.branch,
            diffs,
            globallyTruncated,
          }),
        },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "";
    parsed = tryParseDraftJson(content);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OpenAI 호출 중 알 수 없는 오류";
    throw new ApiError(502, "LLM_FAILED", `LLM 호출에 실패했습니다: ${message}`);
  }

  if (!parsed) {
    throw new ApiError(
      502,
      "LLM_FAILED",
      "LLM 응답을 파싱하지 못했습니다.",
    );
  }

  const draft: Draft = {
    contextKey,
    repoFullName: input.repoFullName,
    branch: input.branch,
    commitShas: input.commitShas,
    title: parsed.title,
    summary: parsed.summary,
    body: parsed.body,
    generatedAt: new Date().toISOString(),
    model: hasGithubToken() ? env.OPENAI_MODEL : `${env.OPENAI_MODEL} (mock-diff)`,
  };
  draftCache.set(contextKey, draft);
  return draft;
}
