import { requestJson } from "./apiClient";
import type { Branch, CommitSummary, Repository } from "../types/github";

type RepositoriesResponse = {
  repositories: Repository[];
};

type BranchesResponse = {
  branches: Branch[];
};

type CommitsResponse = {
  commits: CommitSummary[];
};

export const fetchRepositories = async () => {
  const data = await requestJson<RepositoriesResponse>("/api/github/repositories");
  return data.repositories;
};

export const fetchBranches = async (repositoryFullName: string) => {
  const data = await requestJson<BranchesResponse>(`/api/github/repositories/${repositoryFullName}/branches`);
  return data.branches;
};

export const fetchCommits = async (repositoryFullName: string, branchName: string) => {
  const params = new URLSearchParams({ branch: branchName });
  const data = await requestJson<CommitsResponse>(`/api/github/repositories/${repositoryFullName}/commits?${params.toString()}`);
  return data.commits;
};
