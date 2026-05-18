export type RepoSummary = {
  name: string;
  defaultBranch: string;
};

export type CommitSummary = {
  sha: string;
  message: string;
  author: string;
  date: string;
};

export type CommitDetail = CommitSummary & {
  body: string;
  diffSummary: string;
};

export type DraftStatus = 'draft' | 'published';

export type Draft = {
  id: string;
  repo: string;
  branch: string;
  commitSha: string;
  title: string;
  summary: string;
  body: string;
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  publishedUrl?: string;
};

export type ApiResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };
