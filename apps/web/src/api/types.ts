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

export interface GenerateBlogPayload {
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commitShas: string[];
}

export interface UpdatePostPayload {
  title: string;
  summary: string;
  content: string;
}

