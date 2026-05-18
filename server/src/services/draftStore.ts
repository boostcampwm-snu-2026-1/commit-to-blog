import { randomUUID } from 'node:crypto';
import type { Draft, DraftStatus } from 'shared';

export type CreateDraftInput = {
  repo: string;
  branch: string;
  commitSha: string;
  title: string;
  summary: string;
  body: string;
};

export type UpdateDraftInput = Partial<{
  title: string;
  summary: string;
  body: string;
  status: DraftStatus;
  publishedUrl: string;
}>;

const drafts = new Map<string, Draft>();

export const draftStore = {
  create(input: CreateDraftInput): Draft {
    const now = new Date().toISOString();
    const draft: Draft = {
      id: randomUUID(),
      ...input,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    drafts.set(draft.id, draft);
    return draft;
  },

  get(id: string): Draft | undefined {
    return drafts.get(id);
  },

  list(): Draft[] {
    return Array.from(drafts.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  update(id: string, patch: UpdateDraftInput): Draft | undefined {
    const existing = drafts.get(id);
    if (!existing) return undefined;
    const updated: Draft = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    drafts.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return drafts.delete(id);
  },
};
