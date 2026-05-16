import type { SavedPost } from './types'

export async function updatePostDraft(
  post: SavedPost,
  updates: Partial<Pick<SavedPost, 'title' | 'summary' | 'body'>>,
): Promise<SavedPost> {
  return {
    ...post,
    ...updates,
  }
}

export async function markPostAsPublished(post: SavedPost): Promise<SavedPost> {
  return {
    ...post,
    status: 'published',
  }
}
