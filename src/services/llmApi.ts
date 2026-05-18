import { requestJson } from "./apiClient";
import type { BlogDraft } from "../types/blog";

type DraftResponse = {
  draft: BlogDraft;
};

type CreateDraftInput = {
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
};

export const createDraft = async (input: CreateDraftInput) => {
  const data = await requestJson<DraftResponse>("/api/llm/drafts", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      language: "ko",
    }),
  });

  return data.draft;
};
