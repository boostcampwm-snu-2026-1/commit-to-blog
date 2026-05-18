import { env } from "../config/env";
import type { Branch, ChangedFile, CommitDetail, CommitSummary, Repository } from "../types/github";

const GITHUB_API_BASE_URL = "https://api.github.com";
const MAX_PATCH_LINES = 80;

type GitHubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  html_url: string;
  private: boolean;
};

type GitHubBranchResponse = {
  name: string;
  protected: boolean;
  commit: {
    sha: string;
  };
};

type GitHubCommitSummaryResponse = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
  };
  author: {
    login: string;
  } | null;
};

type GitHubChangedFileResponse = {
  filename: string;
  status: ChangedFile["status"];
  additions: number;
  deletions: number;
  patch?: string;
};

type GitHubCommitDetailResponse = GitHubCommitSummaryResponse & {
  files?: GitHubChangedFileResponse[];
};

export class GitHubServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "GitHubServiceError";
  }
}

const encodePath = (...segments: string[]) => segments.map((segment) => encodeURIComponent(segment)).join("/");

const summarizePatch = (patch: string | undefined) => {
  if (!patch) {
    return undefined;
  }

  const meaningfulLines = patch
    .split("\n")
    .filter((line) => !line.startsWith("+++") && !line.startsWith("---"))
    .slice(0, MAX_PATCH_LINES);

  return meaningfulLines.length < patch.split("\n").length
    ? `${meaningfulLines.join("\n")}\n...`
    : meaningfulLines.join("\n");
};

const mapGitHubError = (status: number) => {
  if (status === 401) {
    return new GitHubServiceError(401, "GITHUB_UNAUTHORIZED", "GitHub authentication failed. Check GITHUB_TOKEN.");
  }

  if (status === 403) {
    return new GitHubServiceError(403, "GITHUB_FORBIDDEN", "GitHub request was forbidden or rate limited.");
  }

  if (status === 404) {
    return new GitHubServiceError(404, "GITHUB_NOT_FOUND", "GitHub resource was not found.");
  }

  return new GitHubServiceError(status, "GITHUB_REQUEST_FAILED", "GitHub request failed.");
};

const githubRequest = async <T>(path: string, searchParams?: URLSearchParams) => {
  if (!env.githubToken) {
    throw new GitHubServiceError(500, "GITHUB_TOKEN_MISSING", "GITHUB_TOKEN is not configured on the server.");
  }

  const url = new URL(`${GITHUB_API_BASE_URL}${path}`);
  searchParams?.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.githubToken}`,
      "User-Agent": "commit-to-blog",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw mapGitHubError(response.status);
  }

  return (await response.json()) as T;
};

const normalizeRepository = (repository: GitHubRepositoryResponse): Repository => ({
  id: String(repository.id),
  name: repository.name,
  fullName: repository.full_name,
  description: repository.description,
  defaultBranch: repository.default_branch,
  htmlUrl: repository.html_url,
  visibility: repository.private ? "private" : "public",
});

const normalizeBranch = (branch: GitHubBranchResponse): Branch => ({
  name: branch.name,
  sha: branch.commit.sha,
  protected: branch.protected,
});

const normalizeCommitSummary = (commit: GitHubCommitSummaryResponse): CommitSummary => ({
  sha: commit.sha,
  message: commit.commit.message,
  authorName: commit.author?.login ?? commit.commit.author?.name ?? "unknown",
  authorDate: commit.commit.author?.date ?? "",
  htmlUrl: commit.html_url,
});

const normalizeChangedFile = (file: GitHubChangedFileResponse): ChangedFile => ({
  filename: file.filename,
  status: file.status,
  additions: file.additions,
  deletions: file.deletions,
  patchSummary: summarizePatch(file.patch),
});

export const listRepositories = async (): Promise<Repository[]> => {
  const repositories = await githubRequest<GitHubRepositoryResponse[]>("/user/repos", new URLSearchParams({
    sort: "updated",
    per_page: "100",
  }));

  return repositories.map(normalizeRepository);
};

export const listBranches = async (owner: string, repo: string): Promise<Branch[]> => {
  const branches = await githubRequest<GitHubBranchResponse[]>(
    `/repos/${encodePath(owner, repo)}/branches`,
    new URLSearchParams({ per_page: "100" }),
  );

  return branches.map(normalizeBranch);
};

export const listCommits = async (owner: string, repo: string, branch: string): Promise<CommitSummary[]> => {
  const commits = await githubRequest<GitHubCommitSummaryResponse[]>(
    `/repos/${encodePath(owner, repo)}/commits`,
    new URLSearchParams({
      sha: branch,
      per_page: "50",
    }),
  );

  return commits.map(normalizeCommitSummary);
};

export const getCommitDetail = async (owner: string, repo: string, sha: string): Promise<CommitDetail> => {
  const commit = await githubRequest<GitHubCommitDetailResponse>(`/repos/${encodePath(owner, repo)}/commits/${encodeURIComponent(sha)}`);

  return {
    ...normalizeCommitSummary(commit),
    changedFiles: commit.files?.map(normalizeChangedFile) ?? [],
  };
};
