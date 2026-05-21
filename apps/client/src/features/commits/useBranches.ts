import { useQuery } from "@tanstack/react-query";
import type { ListBranchesResponse } from "@commit-to-blog/shared";
import { listBranches } from "../../api/branches.js";

export function useBranches(owner: string | null, repo: string | null) {
  return useQuery<ListBranchesResponse, Error>({
    queryKey: ["branches", owner, repo],
    queryFn: () => listBranches(owner!, repo!),
    enabled: Boolean(owner && repo),
  });
}
