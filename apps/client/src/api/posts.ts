import type {
  CreatePostRequest,
  ListPostsResponse,
  Post,
  PostStatus,
  UpdatePostRequest,
} from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export function listPosts(
  status: PostStatus | "all" = "all",
): Promise<ListPostsResponse> {
  const qs = status === "all" ? "" : `?status=${status}`;
  return apiFetch<ListPostsResponse>(`/api/posts${qs}`);
}

export function getPost(id: string): Promise<{ post: Post }> {
  return apiFetch<{ post: Post }>(`/api/posts/${id}`);
}

export function createPost(body: CreatePostRequest): Promise<{ post: Post }> {
  return apiFetch<{ post: Post }>(`/api/posts`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updatePost(
  id: string,
  patch: UpdatePostRequest,
): Promise<{ post: Post }> {
  return apiFetch<{ post: Post }>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export function publishPost(
  id: string,
  publish: boolean,
): Promise<{ post: Post }> {
  return apiFetch<{ post: Post }>(`/api/posts/${id}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ publish }),
  });
}

export function deletePost(id: string): Promise<void> {
  return apiFetch<void>(`/api/posts/${id}`, {
    method: "DELETE",
  });
}
