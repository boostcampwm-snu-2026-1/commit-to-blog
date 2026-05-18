export type BlogDraft = {
  title: string;
  summary: string;
  content: string;
  sourceCommitShas: string[];
};

export type EditablePost = {
  title: string;
  summary: string;
  content: string;
};

export type BlogPostStatus = "saved" | "published";

export type BlogPost = EditablePost & {
  id: string;
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
};

export type SavePostInput = EditablePost & {
  repositoryFullName: string;
  branchName: string;
  commitShas: string[];
};
