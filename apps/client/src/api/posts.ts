import type {
  CreatePostRequest,
  ListPostsResponse,
  Post,
  PostStatus,
  PublishExternalRequest,
  PublishExternalResponse,
  UpdatePostRequest,
} from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export type ListPostsParams = {
  status?: PostStatus | "all";
  tag?: string;
  q?: string;
};

export function listPosts(
  params: ListPostsParams = {},
): Promise<ListPostsResponse> {
  const qs = new URLSearchParams();
  if (params.status && params.status !== "all") qs.set("status", params.status);
  if (params.tag) qs.set("tag", params.tag);
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<ListPostsResponse>(`/api/posts${suffix}`);
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

export function publishExternal(
  id: string,
  body: PublishExternalRequest = {},
): Promise<PublishExternalResponse> {
  return apiFetch<PublishExternalResponse>(
    `/api/posts/${id}/publish-external`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export function deletePost(id: string): Promise<void> {
  return apiFetch<void>(`/api/posts/${id}`, {
    method: "DELETE",
  });
}
