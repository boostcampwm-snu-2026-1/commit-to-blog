export type RepoOwner = {
  login: string;
  avatarUrl: string;
};

export type Repo = {
  /** GitHub global node ID (GraphQL) */
  id: string;
  /** "owner/name" */
  fullName: string;
  name: string;
  owner: RepoOwner;
  defaultBranch: string;
  description: string | null;
  /** UTC ISO 8601 */
  updatedAt: string;
};

export type ListReposResponse = {
  repos: Repo[];
};
