import { create } from "zustand";
import type { SummarizeResponse } from "../types";

type DraftState = {
  selectedRepo?: string;
  selectedBranch?: string;
  selectedSha?: string;
  draft?: SummarizeResponse;
  setRepo: (repo: string | undefined) => void;
  setBranch: (branch: string | undefined) => void;
  setSha: (sha: string | undefined) => void;
  setDraft: (draft: SummarizeResponse | undefined) => void;
  patchDraft: (patch: Partial<SummarizeResponse>) => void;
  reset: () => void;
};

export const useCreateDraftStore = create<DraftState>((set) => ({
  setRepo: (selectedRepo) =>
    set({ selectedRepo, selectedBranch: undefined, selectedSha: undefined, draft: undefined }),
  setBranch: (selectedBranch) =>
    set({ selectedBranch, selectedSha: undefined, draft: undefined }),
  setSha: (selectedSha) => set({ selectedSha, draft: undefined }),
  setDraft: (draft) => set({ draft }),
  patchDraft: (patch) =>
    set((s) => ({ draft: s.draft ? { ...s.draft, ...patch } : s.draft })),
  reset: () =>
    set({
      selectedRepo: undefined,
      selectedBranch: undefined,
      selectedSha: undefined,
      draft: undefined,
    }),
}));
