import { fetchBranches, fetchCommits, fetchRepositories } from './api'

export const githubQueries = {
  repositories: () => fetchRepositories(),
  branches: (repositoryId: string) => fetchBranches(repositoryId),
  commits: (repositoryId: string, branchName: string) =>
    fetchCommits(repositoryId, branchName),
}
