import type { GithubCommit } from '@/features/github/types'
import type { SavedPost } from '@/features/posts/types'

export type GenerateDraftInput = {
  repositoryName: string
  branchName: string
  commits: GithubCommit[]
}

export type GenerateDraftResult = SavedPost
