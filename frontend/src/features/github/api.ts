import type { GithubBranch, GithubCommit, GithubRepository } from './types'

const repositories: GithubRepository[] = [
  {
    id: 'repo-1',
    name: 'commit-to-blog',
    owner: 'teseuteu',
    defaultBranch: 'main',
    description: 'Generate blog drafts from meaningful commit history.',
  },
  {
    id: 'repo-2',
    name: 'frontend-lab',
    owner: 'teseuteu',
    defaultBranch: 'develop',
    description: 'Sandbox for component and design experiments.',
  },
]

const branchesByRepository: Record<string, GithubBranch[]> = {
  'repo-1': [
    { name: 'main', commitCount: 128, lastUpdated: '2026-05-17' },
    { name: 'feature/news-card', commitCount: 9, lastUpdated: '2026-05-16' },
  ],
  'repo-2': [
    { name: 'develop', commitCount: 64, lastUpdated: '2026-05-15' },
    { name: 'experiment/hero-layout', commitCount: 12, lastUpdated: '2026-05-13' },
  ],
}

const commitsByBranch: Record<string, GithubCommit[]> = {
  'repo-1:main': [
    {
      sha: '0eb85e8',
      message: 'feat: #2 install tailwindcss and shadcn',
      author: 'teseuteu',
      committedAt: '2026-05-17 11:20',
    },
    {
      sha: '7c07ccc',
      message: 'docs: #1 commit message rules',
      author: 'teseuteu',
      committedAt: '2026-05-17 10:12',
    },
  ],
  'repo-1:feature/news-card': [
    {
      sha: '9ad2ef1',
      message: 'feat: #3 뉴스 카드 컴포넌트',
      author: 'teseuteu',
      committedAt: '2026-05-16 21:08',
    },
  ],
  'repo-2:develop': [
    {
      sha: '1e44ad8',
      message: 'fix: tighten card spacing tokens',
      author: 'teseuteu',
      committedAt: '2026-05-15 18:04',
    },
  ],
  'repo-2:experiment/hero-layout': [
    {
      sha: '3ce8b0d',
      message: 'feat: build alternate landing hero',
      author: 'teseuteu',
      committedAt: '2026-05-13 09:44',
    },
  ],
}

export async function fetchRepositories(): Promise<GithubRepository[]> {
  return repositories
}

export async function fetchBranches(
  repositoryId: string,
): Promise<GithubBranch[]> {
  return branchesByRepository[repositoryId] ?? []
}

export async function fetchCommits(
  repositoryId: string,
  branchName: string,
): Promise<GithubCommit[]> {
  return commitsByBranch[`${repositoryId}:${branchName}`] ?? []
}
