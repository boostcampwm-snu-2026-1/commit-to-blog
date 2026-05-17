import type { GithubCommit } from '@/features/github/types'

export type PostStatus = 'draft' | 'published'

export type SavedPost = {
  id: string
  title: string
  summary: string
  body: string
  status: PostStatus
  username: string
  postId: string
  sourceCommits: GithubCommit[]
}
