import { randomUUID } from "node:crypto";
import type { BlogPost, BlogPostStatus, SavePostInput } from "../types/blog";

const posts = new Map<string, BlogPost>();

export class PostStoreError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "PostStoreError";
  }
}

const validatePostInput = (input: SavePostInput) => {
  if (!input.title.trim()) {
    throw new PostStoreError(400, "POST_TITLE_REQUIRED", "Post title is required.");
  }

  if (!input.summary.trim()) {
    throw new PostStoreError(400, "POST_SUMMARY_REQUIRED", "Post summary is required.");
  }

  if (!input.content.trim()) {
    throw new PostStoreError(400, "POST_CONTENT_REQUIRED", "Post content is required.");
  }

  if (!input.repositoryFullName.trim() || !input.branchName.trim()) {
    throw new PostStoreError(400, "POST_SOURCE_REQUIRED", "Repository and branch are required.");
  }

  if (!Array.isArray(input.commitShas) || input.commitShas.length === 0) {
    throw new PostStoreError(400, "POST_COMMITS_REQUIRED", "At least one source commit is required.");
  }
};

const normalizePostInput = (input: SavePostInput): SavePostInput => ({
  title: input.title.trim(),
  summary: input.summary.trim(),
  content: input.content.trim(),
  repositoryFullName: input.repositoryFullName.trim(),
  branchName: input.branchName.trim(),
  commitShas: [...new Set(input.commitShas.map((sha) => sha.trim()).filter(Boolean))],
});

export const listPosts = () => (
  [...posts.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
);

export const getPost = (id: string) => {
  const post = posts.get(id);

  if (!post) {
    throw new PostStoreError(404, "POST_NOT_FOUND", "Post was not found.");
  }

  return post;
};

export const createPost = (input: SavePostInput) => {
  const normalizedInput = normalizePostInput(input);
  validatePostInput(normalizedInput);

  const now = new Date().toISOString();
  const post: BlogPost = {
    id: randomUUID(),
    ...normalizedInput,
    status: "saved",
    createdAt: now,
    updatedAt: now,
  };

  posts.set(post.id, post);
  return post;
};

export const updatePost = (id: string, input: SavePostInput) => {
  const existingPost = getPost(id);
  const normalizedInput = normalizePostInput(input);
  validatePostInput(normalizedInput);

  const post: BlogPost = {
    ...existingPost,
    ...normalizedInput,
    updatedAt: new Date().toISOString(),
  };

  posts.set(id, post);
  return post;
};

export const updatePostStatus = (id: string, status: BlogPostStatus) => {
  const existingPost = getPost(id);
  const post: BlogPost = {
    ...existingPost,
    status,
    updatedAt: new Date().toISOString(),
  };

  posts.set(id, post);
  return post;
};
