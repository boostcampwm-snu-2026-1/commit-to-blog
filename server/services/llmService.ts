import { env } from "../config/env";
import { getCommitDetail } from "./githubService";
import type { BlogDraft, CreateDraftRequest } from "../types/blog";
import type { CommitDetail } from "../types/github";

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const MAX_SELECTED_COMMITS = 10;
const MAX_FILES_PER_COMMIT = 20;
const MAX_PATCH_CHARS_PER_FILE = 1200;
const MAX_EVIDENCE_CHARS = 24000;

type OpenAiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

type DraftJson = {
  title?: unknown;
  summary?: unknown;
  content?: unknown;
};

type EvidenceBundle = {
  repositoryFullName: string;
  branchName: string;
  commits: CommitDetail[];
};

export class LlmServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "LlmServiceError";
  }
}

const splitRepositoryFullName = (repositoryFullName: string) => {
  const [owner, repo, ...rest] = repositoryFullName.split("/");

  if (!owner || !repo || rest.length > 0) {
    throw new LlmServiceError(400, "INVALID_REPOSITORY_FULL_NAME", "repositoryFullName must use owner/repo format.");
  }

  return { owner, repo };
};

const truncate = (value: string, maxLength: number) => (
  value.length > maxLength ? `${value.slice(0, maxLength)}\n...` : value
);

const formatCommitEvidence = (commit: CommitDetail) => {
  const changedFiles = commit.changedFiles
    .slice(0, MAX_FILES_PER_COMMIT)
    .map((file) => {
      const patchSummary = file.patchSummary
        ? `\n      patchSummary:\n${truncate(file.patchSummary, MAX_PATCH_CHARS_PER_FILE)}`
        : "";

      return [
        `    - filename: ${file.filename}`,
        `      status: ${file.status}`,
        `      additions: ${file.additions}`,
        `      deletions: ${file.deletions}`,
        patchSummary,
      ].filter(Boolean).join("\n");
    })
    .join("\n");

  const hiddenFileCount = Math.max(commit.changedFiles.length - MAX_FILES_PER_COMMIT, 0);
  const hiddenNotice = hiddenFileCount > 0 ? `\n    - ${hiddenFileCount} more changed files omitted for length.` : "";

  return [
    `- sha: ${commit.sha}`,
    `  message: ${commit.message}`,
    `  author: ${commit.authorName}`,
    `  date: ${commit.authorDate}`,
    `  changedFiles:`,
    changedFiles || "    - no changed files returned",
    hiddenNotice,
  ].filter(Boolean).join("\n");
};

const buildEvidenceText = (bundle: EvidenceBundle) => {
  const evidence = [
    `repository: ${bundle.repositoryFullName}`,
    `branch: ${bundle.branchName}`,
    "selectedCommits:",
    bundle.commits.map(formatCommitEvidence).join("\n"),
  ].join("\n");

  return truncate(evidence, MAX_EVIDENCE_CHARS);
};

const buildPrompt = (bundle: EvidenceBundle, language: "ko" | "en") => {
  const outputLanguage = language === "ko" ? "Korean" : "English";

  return [
    "You write editable development blog drafts from GitHub commit evidence.",
    "Do not simply list commit messages.",
    "Use only the evidence provided. If intent is unclear, say it is inferred from the changes.",
    `Write in ${outputLanguage}.`,
    "Return strict JSON only with keys: title, summary, content.",
    "The content should use Markdown and include these sections when useful: 배경, 문제 상황, 구현 내용, 주요 변경 사항, 고민한 점, 결과, 다음 개선점.",
    "",
    "Commit evidence:",
    buildEvidenceText(bundle),
  ].join("\n");
};

const parseDraftJson = (content: string): DraftJson => {
  try {
    return JSON.parse(content) as DraftJson;
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new LlmServiceError(502, "LLM_RESPONSE_PARSE_FAILED", "LLM response was not valid JSON.");
    }

    try {
      return JSON.parse(jsonMatch[0]) as DraftJson;
    } catch {
      throw new LlmServiceError(502, "LLM_RESPONSE_PARSE_FAILED", "LLM response JSON could not be parsed.");
    }
  }
};

const assertString = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new LlmServiceError(502, "LLM_RESPONSE_INVALID", `LLM response is missing ${fieldName}.`);
  }

  return value.trim();
};

const callOpenAi = async (prompt: string) => {
  if (!env.openAiApiKey) {
    throw new LlmServiceError(500, "OPENAI_API_KEY_MISSING", "OPENAI_API_KEY is not configured on the server.");
  }

  if (!env.openAiModel) {
    throw new LlmServiceError(500, "OPENAI_MODEL_MISSING", "OPENAI_MODEL is not configured on the server.");
  }

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openAiModel,
      messages: [
        {
          role: "system",
          content: "You are a precise technical writing assistant. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  const payload = await response.json() as OpenAiChatCompletionResponse;

  if (!response.ok) {
    throw new LlmServiceError(response.status, "LLM_REQUEST_FAILED", payload.error?.message ?? "LLM request failed.");
  }

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new LlmServiceError(502, "LLM_EMPTY_RESPONSE", "LLM returned an empty response.");
  }

  return content;
};

export const createBlogDraft = async (request: CreateDraftRequest): Promise<BlogDraft> => {
  const { repositoryFullName, branchName, commitShas, language = "ko" } = request;

  if (!repositoryFullName || !branchName) {
    throw new LlmServiceError(400, "DRAFT_SOURCE_REQUIRED", "repositoryFullName and branchName are required.");
  }

  if (!Array.isArray(commitShas) || commitShas.length === 0) {
    throw new LlmServiceError(400, "COMMITS_REQUIRED", "At least one commit sha is required.");
  }

  if (commitShas.length > MAX_SELECTED_COMMITS) {
    throw new LlmServiceError(400, "TOO_MANY_COMMITS", `Select ${MAX_SELECTED_COMMITS} commits or fewer.`);
  }

  const { owner, repo } = splitRepositoryFullName(repositoryFullName);
  const commits = await Promise.all(commitShas.map((sha) => getCommitDetail(owner, repo, sha)));
  const prompt = buildPrompt({ repositoryFullName, branchName, commits }, language);
  const responseContent = await callOpenAi(prompt);
  const draftJson = parseDraftJson(responseContent);

  return {
    title: assertString(draftJson.title, "title"),
    summary: assertString(draftJson.summary, "summary"),
    content: assertString(draftJson.content, "content"),
    sourceCommitShas: commits.map((commit) => commit.sha),
  };
};
