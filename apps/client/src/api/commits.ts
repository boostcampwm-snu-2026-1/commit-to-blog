import type { ListCommitsResponse } from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export function listCommits(
  owner: string,
  repo: string,
  branch: string,
  limit = 20,
): Promise<ListCommitsResponse> {
  const params = new URLSearchParams({
    branch,
    limit: String(limit),
  });
  return apiFetch<ListCommitsResponse>(
    `/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?${params.toString()}`,
  );
}
