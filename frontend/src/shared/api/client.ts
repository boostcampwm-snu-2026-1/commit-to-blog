export type Repository = {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
};

export type Branch = {
  name: string;
};

export type Commit = {
  sha: string;
  message: string;
  author: string;
  committed_at: string;
  url: string;
  additions: number;
  deletions: number;
  changed_files: number;
  files: CommitFile[];
};

export type CommitFile = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string | null;
};

export type BlogPost = {
  id: number;
  title: string;
  repository_full_name: string;
  branch: string;
  summary: string;
  content: string;
  hero_emoji: string;
  author: string;
  reading_minutes: number;
  likes: number;
  comments: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type PostStatus = "draft" | "published";

export type PostAnalytics = {
  total_posts: number;
  draft_posts: number;
  published_posts: number;
  total_likes: number;
  total_comments: number;
  average_reading_minutes: number;
};

export type Draft = {
  title: string;
  repository_full_name: string;
  branch: string;
  summary: string;
  content: string;
  hero_emoji: string;
  author: string;
  reading_minutes: number;
  commit_count?: number;
  changed_files?: number;
  additions?: number;
  deletions?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  repositories: () => request<Repository[]>("/github/repositories"),
  branches: (repository: string) => request<Branch[]>(`/github/branches?repository=${encodeURIComponent(repository)}`),
  commits: (repository: string, branch: string) =>
    request<Commit[]>(`/github/commits?repository=${encodeURIComponent(repository)}&branch=${encodeURIComponent(branch)}`),
  draft: (payload: { repository_full_name: string; branch: string; commit_shas: string[] }) =>
    request<Draft>("/drafts", { method: "POST", body: JSON.stringify(payload) }),
  posts: (filters?: { status?: PostStatus; repository?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.repository) params.set("repository", filters.repository);
    const query = params.toString();
    return request<BlogPost[]>(`/posts${query ? `?${query}` : ""}`);
  },
  postAnalytics: () => request<PostAnalytics>("/posts/analytics"),
  createPost: (payload: Draft) => request<BlogPost>("/posts", { method: "POST", body: JSON.stringify(payload) }),
  updatePost: (id: number, payload: Partial<BlogPost> | Draft) =>
    request<BlogPost>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  publishPost: (id: number) => request<BlogPost>(`/posts/${id}/publish`, { method: "POST" }),
  likePost: (id: number) => request<BlogPost>(`/posts/${id}/like`, { method: "POST" }),
  commentPost: (id: number) => request<BlogPost>(`/posts/${id}/comments`, { method: "POST" }),
};
