import { randomUUID } from "node:crypto";
import type {
  CreatePostRequest,
  Post,
  PostStatus,
  UpdatePostRequest,
} from "@commit-to-blog/shared";
import { ApiError } from "../../lib/ApiError.js";
import { postsRepository } from "./repository.js";

export const postsService = {
  async list(status?: PostStatus | "all"): Promise<Post[]> {
    return postsRepository.list({ status });
  },

  async get(id: string): Promise<Post> {
    const post = await postsRepository.get(id);
    if (!post) throw ApiError.notFound(`포스트를 찾을 수 없습니다: ${id}`);
    return post;
  },

  async create(input: CreatePostRequest): Promise<Post> {
    const now = new Date().toISOString();
    const post: Post = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      summary: input.summary,
      source: input.source,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    };
    return postsRepository.insert(post);
  },

  async update(id: string, patch: UpdatePostRequest): Promise<Post> {
    const next = await postsRepository.update(id, patch);
    if (!next) throw ApiError.notFound(`포스트를 찾을 수 없습니다: ${id}`);
    return next;
  },

  async setPublished(id: string, publish: boolean): Promise<Post> {
    const now = new Date().toISOString();
    const next = await postsRepository.update(id, {
      status: publish ? "published" : "draft",
      publishedAt: publish ? now : null,
    });
    if (!next) throw ApiError.notFound(`포스트를 찾을 수 없습니다: ${id}`);
    return next;
  },

  async delete(id: string): Promise<void> {
    const ok = await postsRepository.delete(id);
    if (!ok) throw ApiError.notFound(`포스트를 찾을 수 없습니다: ${id}`);
  },
};
