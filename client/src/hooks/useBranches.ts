import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

const REPO_PATTERN = /^[^/]+\/[^/]+$/;

export function useBranches(repo: string) {
  const trimmed = repo.trim();
  return useQuery({
    queryKey: ['branches', trimmed],
    queryFn: () =>
      apiFetch<string[]>(`/api/github/branches?repo=${encodeURIComponent(trimmed)}`),
    enabled: REPO_PATTERN.test(trimmed),
  });
}
