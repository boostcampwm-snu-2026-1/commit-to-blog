import type { ListReposResponse } from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export function listRepos(q?: string): Promise<ListReposResponse> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch<ListReposResponse>(`/api/repos${qs}`);
}
