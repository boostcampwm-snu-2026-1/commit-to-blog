import { Octokit } from '@octokit/rest';
import type { CommitSummary, RepoSummary } from 'shared';
import { env } from '../env.js';

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

export const githubClient = {
  async listRepos(query?: string): Promise<RepoSummary[]> {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'pushed',
    });
    const needle = query?.trim().toLowerCase();
    const filtered = needle
      ? data.filter((r) => r.full_name.toLowerCase().includes(needle))
      : data;
    return filtered.map((r) => ({
      name: r.full_name,
      defaultBranch: r.default_branch,
    }));
  },

  async listBranches(repo: string): Promise<string[]> {
    const [owner, name] = repo.split('/');
    const { data } = await octokit.repos.listBranches({
      owner: owner!,
      repo: name!,
      per_page: 100,
    });
    return data.map((b) => b.name);
  },

  async listCommits(repo: string, branch: string, limit = 20): Promise<CommitSummary[]> {
    const [owner, name] = repo.split('/');
    const { data } = await octokit.repos.listCommits({
      owner: owner!,
      repo: name!,
      sha: branch,
      per_page: limit,
    });
    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split('\n')[0] ?? '',
      author: c.author?.login ?? c.commit.author?.name ?? 'unknown',
      date: c.commit.author?.date ?? new Date(0).toISOString(),
    }));
  },
};
