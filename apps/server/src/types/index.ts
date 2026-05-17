export type Repo = {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  updatedAt: string;
};

export type Branch = {
  name: string;
  sha: string;
};

export type Commit = {
  sha: string;
  shortSha: string;
  message: string;
  body?: string;
  author: {
    name: string;
    login?: string;
    avatarUrl?: string;
  };
  date: string;
  url: string;
};

export type CommitFile = {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
};

export type CommitDetail = Commit & {
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: CommitFile[];
};

export type BlogDraft = {
  id: string;
  repo: string;
  branch: string;
  commitShas: string[];
  title: string;
  excerpt: string;
  contentMd: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type SummarizeStyle = "default" | "short" | "technical" | "casual";

export type SummarizeRequest = {
  repo: string;
  branch: string;
  commits: Array<
    Pick<CommitDetail, "sha" | "message" | "body" | "files" | "stats">
  >;
  style?: SummarizeStyle;
};

export type SummarizeResponse = {
  title: string;
  excerpt: string;
  contentMd: string;
};
