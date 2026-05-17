export type CommitAuthor = {
  name: string;
  login: string | null;
  avatarUrl: string | null;
};

export type Commit = {
  /** 40-char sha */
  sha: string;
  /** First 7 chars of sha */
  shortSha: string;
  message: string;
  author: CommitAuthor;
  /** UTC ISO 8601 */
  committedAt: string;
  changedFiles?: number;
};

export type ListCommitsResponse = {
  commits: Commit[];
};
