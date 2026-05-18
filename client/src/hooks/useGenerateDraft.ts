import { useMutation } from '@tanstack/react-query';
import type { Draft } from 'shared';
import { apiFetch } from '../lib/api';

type GenerateDraftInput = {
  repo: string;
  branch: string;
  sha: string;
};

export function useGenerateDraft() {
  return useMutation({
    mutationFn: (input: GenerateDraftInput) =>
      apiFetch<Draft>('/api/drafts/generate', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}
