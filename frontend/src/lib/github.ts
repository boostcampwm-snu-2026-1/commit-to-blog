import { readApiError } from "./api";

export type RepositorySummary = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};

type RepositoriesResponse = {
  repositories: RepositorySummary[];
};

export type BranchSummary = {
  name: string;
  commitSha: string;
};

type BranchesResponse = {
  branches: BranchSummary[];
};

export type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
};

type CommitsResponse = {
  commits: CommitSummary[];
};

export async function fetchRepositories(signal?: AbortSignal) {
  const response = await fetch("/api/github/repos", {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Failed to load repositories."),
    );
  }

  const body = (await response.json()) as RepositoriesResponse;

  return body.repositories;
}

export async function fetchBranches(
  owner: string,
  repo: string,
  signal?: AbortSignal,
) {
  const response = await fetch(`/api/github/repos/${owner}/${repo}/branches`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Failed to load branches."));
  }

  const body = (await response.json()) as BranchesResponse;

  return body.branches;
}

export async function fetchCommits(
  owner: string,
  repo: string,
  branch: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `/api/github/repos/${owner}/${repo}/commits?branch=${encodeURIComponent(branch)}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(await readApiError(response, "Failed to load commits."));
  }

  const body = (await response.json()) as CommitsResponse;

  return body.commits;
}
