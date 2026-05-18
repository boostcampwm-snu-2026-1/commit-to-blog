import { useQuery } from '@tanstack/react-query';
import type { CommitSummary } from 'shared';
import { apiFetch } from '../lib/api';

const REPO_PATTERN = /^[^/]+\/[^/]+$/;

export function useCommits(repo: string, branch: string, limit = 20) {
  const trimmedRepo = repo.trim();
  const trimmedBranch = branch.trim();
  return useQuery({
    queryKey: ['commits', trimmedRepo, trimmedBranch, limit],
    queryFn: () => {
      const params = new URLSearchParams({
        repo: trimmedRepo,
        branch: trimmedBranch,
        limit: String(limit),
      });
      return apiFetch<CommitSummary[]>(`/api/github/commits?${params.toString()}`);
    },
    enabled: REPO_PATTERN.test(trimmedRepo) && trimmedBranch.length > 0,
  });
}
