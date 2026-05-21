import { useQuery } from "@tanstack/react-query";
import type { ListCommitsResponse } from "@commit-to-blog/shared";
import { listCommits } from "../../api/commits.js";

export function useCommits(
  owner: string | null,
  repo: string | null,
  branch: string | null,
  limit = 20,
) {
  return useQuery<ListCommitsResponse, Error>({
    queryKey: ["commits", owner, repo, branch, limit],
    queryFn: () => listCommits(owner!, repo!, branch!, limit),
    enabled: Boolean(owner && repo && branch),
  });
}
