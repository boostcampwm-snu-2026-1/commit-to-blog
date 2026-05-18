import { readApiError } from "./api";
import type { CommitSummary, RepositorySummary } from "./github";

type PostRepository = Pick<RepositorySummary, "owner" | "name" | "fullName">;

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  summary: string;
  content: string;
  repository: PostRepository;
  branch: string;
  commits: CommitSummary[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

type CreatePostInput = {
  title: string;
  summary: string;
  content: string;
  repository: PostRepository;
  branch: string;
  commits: CommitSummary[];
};

type CreatePostResponse = {
  post: Post;
};

export async function createDraftPost(
  input: CreatePostInput,
  signal?: AbortSignal,
) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Failed to save draft."));
  }

  const body = (await response.json()) as CreatePostResponse;

  return body.post;
}
