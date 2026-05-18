import { useQuery } from '@tanstack/react-query';
import type { RepoSummary } from 'shared';
import { apiFetch } from '../lib/api';

export function useRepos(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['repos', trimmed],
    queryFn: () => {
      const params = trimmed ? `?q=${encodeURIComponent(trimmed)}` : '';
      return apiFetch<RepoSummary[]>(`/api/github/repos${params}`);
    },
  });
}
