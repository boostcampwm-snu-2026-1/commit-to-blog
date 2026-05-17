import { requestJson } from "./apiClient";
import type { BlogPost, BlogPostStatus, SavePostInput } from "../types/blog";

type PostsResponse = {
  posts: BlogPost[];
};

type PostResponse = {
  post: BlogPost;
};

export const fetchPosts = async () => {
  const data = await requestJson<PostsResponse>("/api/posts");
  return data.posts;
};

export const createPost = async (input: SavePostInput) => {
  const data = await requestJson<PostResponse>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return data.post;
};

export const updatePost = async (id: string, input: SavePostInput) => {
  const data = await requestJson<PostResponse>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

  return data.post;
};

export const updatePostStatus = async (id: string, status: BlogPostStatus) => {
  const data = await requestJson<PostResponse>(`/api/posts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return data.post;
};
