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

export type BlogPostStatus = "saved" | "published";

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
};

export type SavePostInput = {
  title: string;
  summary: string;
  content: string;
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
};
