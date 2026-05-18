import { Octokit } from '@octokit/rest';
import type { RepoSummary } from 'shared';
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
};
