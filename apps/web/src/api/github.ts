import { api } from "./client";
import type { Branch, Commit, CommitDetail, Repo } from "../types";

export const githubApi = {
  listRepos: () => api<Repo[]>("/api/github/repos"),
  listBranches: (repo: string) =>
    api<Branch[]>(`/api/github/branches?repo=${encodeURIComponent(repo)}`),
  listCommits: (repo: string, branch: string, limit = 30) =>
    api<Commit[]>(
      `/api/github/commits?repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}&limit=${limit}`,
    ),
  getCommit: (repo: string, sha: string) =>
    api<CommitDetail>(
      `/api/github/commit?repo=${encodeURIComponent(repo)}&sha=${encodeURIComponent(sha)}`,
    ),
};
