import { HttpError } from "../middleware/error.middleware.js";
import { env } from "../config/env.js";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
  owner: {
    login: string;
  };
};

type GitHubBranch = {
  name: string;
  commit: {
    sha: string;
  };
};

type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: {
      name?: string;
      email?: string;
      date?: string;
    };
  };
  author?: {
    login?: string;
  };
};

type GitHubApiError = {
  message?: string;
};

export type RepositorySummary = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};

export type BranchSummary = {
  name: string;
  commitSha: string;
};

export type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
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

    throw new HttpError(response.status >= 500 ? 502 : response.status, message);
  }

  return response.json() as Promise<T>;
}

function normalizeRepository(repository: GitHubRepository): RepositorySummary {
  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    owner: repository.owner.login,
    private: repository.private,
    defaultBranch: repository.default_branch,
    htmlUrl: repository.html_url,
  };
}

function normalizeBranch(branch: GitHubBranch): BranchSummary {
  return {
    name: branch.name,
    commitSha: branch.commit.sha,
  };
}

function normalizeCommit(commit: GitHubCommit): CommitSummary {
  return {
    sha: commit.sha,
    message: commit.commit.message,
    authorName:
      commit.commit.author?.name ?? commit.author?.login ?? "Unknown author",
    authorDate:
      commit.commit.author?.date ?? new Date().toISOString(),
    htmlUrl: commit.html_url,
  };
}

export async function listRepositories() {
  const repositories = await requestGitHub<GitHubRepository[]>("/user/repos?per_page=100");

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
