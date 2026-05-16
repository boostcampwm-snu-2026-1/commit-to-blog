export type GithubRepository = {
  id: string
  name: string
  owner: string
  defaultBranch: string
  description: string
}

export type GithubBranch = {
  name: string
  commitCount: number
  lastUpdated: string
}

export type GithubCommit = {
  sha: string
  message: string
  author: string
  committedAt: string
}
