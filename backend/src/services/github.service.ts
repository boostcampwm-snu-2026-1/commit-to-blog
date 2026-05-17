import { HttpError } from "../middleware/error.middleware.js";
import { env } from "../config/env.js";
import {
  normalizeBranch,
  normalizeCommit,
  normalizeRepository,
  type BranchSummary,
  type CommitSummary,
  type GitHubBranch,
  type GitHubCommit,
  type GitHubRepository,
  type RepositorySummary,
} from "./github.normalizer.js";
type GitHubApiError = {
  message?: string;
};

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

function createHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.githubToken}`,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
}

async function requestGitHub<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...createHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "GitHub API request failed";

    try {
      const body = (await response.json()) as GitHubApiError;
      if (typeof body.message === "string" && body.message.trim() !== "") {
        message = body.message;
      }
    } catch {
      // Keep the generic message if GitHub does not return JSON.
    }

    if (response.status === 403) {
      throw new HttpError(403, `GitHub API access denied: ${message}`);
    }

    if (response.status === 404) {
      throw new HttpError(404, `GitHub resource not found: ${message}`);
    }

    throw new HttpError(
      response.status >= 500 ? 502 : response.status,
      message,
    );
  }

  return response.json() as Promise<T>;
}

export async function listRepositories() {
  const repositories = await requestGitHub<GitHubRepository[]>(
    "/user/repos?per_page=100",
  );

  return {
    repositories: repositories.map(normalizeRepository),
  };
}

export async function listBranches(owner: string, repo: string) {
  const branches = await requestGitHub<GitHubBranch[]>(
    `/repos/${owner}/${repo}/branches?per_page=100`,
  );

  return {
    branches: branches.map(normalizeBranch),
  };
}

export async function listCommits(owner: string, repo: string, branch: string) {
  const commits = await requestGitHub<GitHubCommit[]>(
    `/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=100`,
  );

  return {
    commits: commits.map(normalizeCommit),
  };
}
