import { fetchSavedPost, fetchSavedPosts } from './api'

export const postsQueries = {
  all: () => fetchSavedPosts(),
  byId: (postId: string) => fetchSavedPost(postId),
}
