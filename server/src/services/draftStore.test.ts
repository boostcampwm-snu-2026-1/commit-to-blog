import { describe, it, expect, beforeEach } from 'vitest';
import { draftStore } from './draftStore.js';

const baseInput = {
  repo: 'pkdje/commit-to-blog',
  branch: 'main',
  commitSha: 'abc1234',
  title: 'Title',
  summary: 'Summary',
  body: 'Body',
};

beforeEach(() => {
  for (const d of draftStore.list()) {
    draftStore.delete(d.id);
  }
});

describe('draftStore.create', () => {
  it('returns a draft with a generated id, draft status, and matching timestamps', () => {
    const draft = draftStore.create(baseInput);

    expect(draft.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(draft.status).toBe('draft');
    expect(draft.createdAt).toBe(draft.updatedAt);
    expect(draft).toMatchObject(baseInput);
  });

  it('produces a unique id per call', () => {
    const a = draftStore.create(baseInput);
    const b = draftStore.create(baseInput);
    expect(a.id).not.toBe(b.id);
  });
});

describe('draftStore.get', () => {
  it('returns the draft by id', () => {
    const draft = draftStore.create(baseInput);
    expect(draftStore.get(draft.id)).toEqual(draft);
  });

  it('returns undefined for unknown id', () => {
    expect(draftStore.get('nonexistent')).toBeUndefined();
  });
});

describe('draftStore.list', () => {
  it('returns drafts in newest-first order by createdAt', async () => {
    const a = draftStore.create({ ...baseInput, title: 'A' });
    await new Promise((r) => setTimeout(r, 5));
    const b = draftStore.create({ ...baseInput, title: 'B' });

    const list = draftStore.list();
    expect(list.map((d) => d.title)).toEqual(['B', 'A']);
    expect(list[0]?.id).toBe(b.id);
    expect(list[1]?.id).toBe(a.id);
  });

  it('returns empty array when no drafts exist', () => {
    expect(draftStore.list()).toEqual([]);
  });
});

describe('draftStore.update', () => {
  it('applies patch fields and bumps updatedAt', async () => {
    const draft = draftStore.create(baseInput);
    await new Promise((r) => setTimeout(r, 5));

    const updated = draftStore.update(draft.id, {
      title: 'New Title',
      status: 'published',
      publishedUrl: 'https://example.com/x.md',
    });

    expect(updated?.title).toBe('New Title');
    expect(updated?.status).toBe('published');
    expect(updated?.publishedUrl).toBe('https://example.com/x.md');
    expect(updated?.summary).toBe(baseInput.summary);
    expect(updated?.createdAt).toBe(draft.createdAt);
    expect(updated && updated.updatedAt > draft.updatedAt).toBe(true);
  });

  it('returns undefined for unknown id', () => {
    expect(draftStore.update('nonexistent', { title: 'x' })).toBeUndefined();
  });
});

describe('draftStore.delete', () => {
  it('removes the draft and returns true', () => {
    const draft = draftStore.create(baseInput);
    expect(draftStore.delete(draft.id)).toBe(true);
    expect(draftStore.get(draft.id)).toBeUndefined();
  });

  it('returns false for unknown id', () => {
    expect(draftStore.delete('nonexistent')).toBe(false);
  });
});
