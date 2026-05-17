import { z } from "zod";

import type { PostRecord } from "../../types.js";
import { findPostById, listAllPosts, replacePost } from "./posts.repository.js";

const updatePostSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  content: z.string().trim().min(1)
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export function listSavedPosts() {
  return listAllPosts();
}

export function getSavedPost(postId: string) {
  return findPostById(postId);
}

export function savePostEdits(postId: string, input: UpdatePostInput): PostRecord | null {
  const parsedInput = updatePostSchema.parse(input);
  const currentPost = findPostById(postId);

  if (!currentPost) {
    return null;
  }

  const updatedPost: PostRecord = {
    ...currentPost,
    ...parsedInput,
    updatedAt: new Date().toISOString()
  };

  return replacePost(updatedPost);
}

export function publishPost(postId: string) {
  const currentPost = findPostById(postId);

  if (!currentPost) {
    return null;
  }

  const publishedAt = new Date().toISOString();

  return replacePost({
    ...currentPost,
    status: "published",
    updatedAt: publishedAt,
    publishedAt
  });
}

