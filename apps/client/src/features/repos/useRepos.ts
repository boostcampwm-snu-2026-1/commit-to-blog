import { useQuery } from "@tanstack/react-query";
import type { ListReposResponse } from "@commit-to-blog/shared";
import { listRepos } from "../../api/repos.js";

export function useRepos(q?: string) {
  return useQuery<ListReposResponse, Error>({
    queryKey: ["repos", q ?? ""],
    queryFn: () => listRepos(q),
  });
}
