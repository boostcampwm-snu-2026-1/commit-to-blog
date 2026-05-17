// Shared types between client and server. Re-declared here intentionally instead
// of introducing a shared workspace package (out of scope for week 1).

export interface RepoSummary {
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
}

export interface BranchSummary {
  name: string;
}

export interface CommitSummary {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface PostRow {
  id: number;
  title: string;
  content: string;
  branch: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let msg = `request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      // ignore json parse errors; keep default message
    }
    throw new ApiError(res.status, msg);
  }
  return (await res.json()) as T;
}

export function listRepos() {
  return fetchJson<RepoSummary[]>('/api/github/repos');
}

export function listBranches(owner: string, repo: string) {
  return fetchJson<BranchSummary[]>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`,
  );
}

export function listCommits(owner: string, repo: string, branch: string) {
  return fetchJson<CommitSummary[]>(
    `/api/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?branch=${encodeURIComponent(branch)}`,
  );
}

export function generateDraft(input: {
  owner: string;
  repo: string;
  branch: string;
  commits: string[];
}) {
  return fetchJson<{ markdown: string }>('/api/ai/draft', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function createPost(input: {
  title: string;
  content: string;
  branch: string;
  status?: 'draft' | 'published';
}) {
  return fetchJson<PostRow>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
