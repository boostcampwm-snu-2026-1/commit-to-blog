export type IntegrationMode = "demo" | "live";
export type PostStatus = "draft" | "published";

export interface RepositorySummary {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface BranchSummary {
  name: string;
  protected: boolean;
  commitSha: string;
}

export interface CommitSummary {
  sha: string;
  message: string;
  authorName: string;
  committedAt: string;
  url: string;
}

export interface FileChange {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
}

export interface CommitDetail extends CommitSummary {
  body: string | null;
  files: FileChange[];
}

export interface PostRecord {
  id: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commitShas: string[];
  sourceCommits: CommitSummary[];
  title: string;
  summary: string;
  content: string;
  status: PostStatus;
  generationMode: IntegrationMode;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface AppMeta {
  githubMode: IntegrationMode;
  openAIMode: IntegrationMode;
  storage: "sqlite";
}

