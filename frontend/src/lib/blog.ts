import { readApiError } from "./api";
import type { CommitSummary, RepositorySummary } from "./github";

export type GeneratedDraft = {
  title: string;
  summary: string;
  content: string;
};

type GenerateBlogDraftInput = {
  repository: Pick<RepositorySummary, "owner" | "name" | "fullName">;
  branch: string;
  commits: CommitSummary[];
};

type GenerateBlogDraftResponse = {
  draft: GeneratedDraft;
};

export async function generateBlogDraft(
  input: GenerateBlogDraftInput,
  signal?: AbortSignal,
) {
  const response = await fetch("/api/blogs/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Failed to generate draft."));
  }

  const body = (await response.json()) as GenerateBlogDraftResponse;

  return body.draft;
}
