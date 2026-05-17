export type BlogDraft = {
  title: string;
  summary: string;
  content: string;
  sourceCommitShas: string[];
};

export type CreateDraftRequest = {
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
  language?: "ko" | "en";
};
