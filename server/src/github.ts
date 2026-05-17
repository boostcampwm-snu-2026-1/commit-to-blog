import { Octokit } from '@octokit/rest';

export class MissingGithubTokenError extends Error {
  constructor() {
    super('GITHUB_TOKEN not set');
    this.name = 'MissingGithubTokenError';
  }
}

/**
 * Build an Octokit client using the current GITHUB_TOKEN env var.
 * Read on every call so tests can swap the env var per-case.
 */
export function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new MissingGithubTokenError();
  }
  return new Octokit({ auth: token });
}

export interface RepoSummary {
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
}

export interface BranchSummary {
  name: string;
}

export interface CommitSummary {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export async function listRepos(): Promise<RepoSummary[]> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 30 });
  return data.map((repo) => ({
    owner: repo.owner?.login ?? '',
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    defaultBranch: repo.default_branch ?? '',
  }));
}

export async function listBranches(
  owner: string,
  repo: string,
): Promise<BranchSummary[]> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listBranches({ owner, repo, per_page: 30 });
  return data.map((branch) => ({ name: branch.name }));
}

export async function listCommits(
  owner: string,
  repo: string,
  branch: string,
): Promise<CommitSummary[]> {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: 30,
  });
  return data.map((entry) => ({
    sha: entry.sha,
    message: entry.commit.message,
    author: entry.commit.author?.name ?? '',
    date: entry.commit.author?.date ?? '',
  }));
}
