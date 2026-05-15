import type {
  AppMeta,
  BranchSummary,
  CommitSummary,
  GenerateBlogPayload,
  PostRecord,
  RepositorySummary,
  UpdatePostPayload
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(body?.message ?? "요청 처리 중 오류가 발생했습니다.");
  }

  return body as T;
}

export const api = {
  getMeta: () => request<AppMeta>("/api/meta"),
  listRepositories: async () => {
    const response = await request<{ repositories: RepositorySummary[] }>("/api/github/repositories");
    return response.repositories;
  },
  listBranches: async (owner: string, repo: string) => {
    const response = await request<{ branches: BranchSummary[] }>(
      `/api/github/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`
    );
    return response.branches;
  },
  listCommits: async (owner: string, repo: string, branch: string) => {
    const response = await request<{ commits: CommitSummary[] }>(
      `/api/github/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?branch=${encodeURIComponent(branch)}`
    );
    return response.commits;
  },
  generateBlog: async (payload: GenerateBlogPayload) => {
    const response = await request<{ post: PostRecord }>("/api/blogs/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response.post;
  },
  listPosts: async () => {
    const response = await request<{ posts: PostRecord[] }>("/api/posts");
    return response.posts;
  },
  getPost: async (postId: string) => {
    const response = await request<{ post: PostRecord }>(`/api/posts/${postId}`);
    return response.post;
  },
  updatePost: async (postId: string, payload: UpdatePostPayload) => {
    const response = await request<{ post: PostRecord }>(`/api/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return response.post;
  },
  publishPost: async (postId: string) => {
    const response = await request<{ post: PostRecord }>(`/api/posts/${postId}/publish`, {
      method: "POST"
    });
    return response.post;
  }
};

