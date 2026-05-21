import type { ListBranchesResponse } from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export function listBranches(
  owner: string,
  repo: string,
): Promise<ListBranchesResponse> {
  return apiFetch<ListBranchesResponse>(
    `/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`,
  );
}
