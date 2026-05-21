import type { ApiErrorBody } from "@commit-to-blog/shared";

const API_BASE = "";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    throw new ApiClientError(
      res.status,
      body,
      body?.error.message ?? `HTTP ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
