import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { closeDb, getDb } from './index.js';

const originalDbPath = process.env.DATABASE_PATH;

beforeEach(() => {
  process.env.DATABASE_PATH = ':memory:';
});

afterEach(() => {
  closeDb();
  if (originalDbPath === undefined) {
    delete process.env.DATABASE_PATH;
  } else {
    process.env.DATABASE_PATH = originalDbPath;
  }
});

interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

describe('posts table schema', () => {
  it('creates posts table with all expected columns after getDb()', () => {
    const db = getDb();
    const columns = db
      .prepare(`PRAGMA table_info(posts)`)
      .all() as ColumnInfo[];

    const byName = new Map(columns.map((c) => [c.name, c]));
    expect(byName.has('id')).toBe(true);
    expect(byName.has('title')).toBe(true);
    expect(byName.has('content')).toBe(true);
    expect(byName.has('branch')).toBe(true);
    expect(byName.has('status')).toBe(true);
    expect(byName.has('created_at')).toBe(true);
    expect(byName.has('updated_at')).toBe(true);

    expect(byName.get('id')?.pk).toBe(1);
    expect(byName.get('title')?.notnull).toBe(1);
    expect(byName.get('content')?.notnull).toBe(1);
    expect(byName.get('branch')?.notnull).toBe(1);
    expect(byName.get('status')?.notnull).toBe(1);
  });
});

describe('insertPost', () => {
  it('returns the full row with id, defaults, and timestamps populated', async () => {
    const { insertPost } = await import('./posts.js');
    const db = getDb();

    const row = insertPost(db, {
      title: 'Hello',
      content: '# body',
      branch: 'main',
      status: 'published',
    });

    expect(row.id).toBeGreaterThan(0);
    expect(row.title).toBe('Hello');
    expect(row.content).toBe('# body');
    expect(row.branch).toBe('main');
    expect(row.status).toBe('published');
    expect(typeof row.created_at).toBe('string');
    expect(row.created_at.length).toBeGreaterThan(0);
    expect(typeof row.updated_at).toBe('string');
    expect(row.updated_at.length).toBeGreaterThan(0);
  });

  it("defaults status to 'draft' when not provided", async () => {
    const { insertPost } = await import('./posts.js');
    const db = getDb();

    const row = insertPost(db, {
      title: 'Untitled',
      content: 'wip',
      branch: 'feature/x',
    });

    expect(row.status).toBe('draft');
  });

  it('auto-increments id across multiple inserts', async () => {
    const { insertPost } = await import('./posts.js');
    const db = getDb();

    const first = insertPost(db, {
      title: 'A',
      content: 'a',
      branch: 'main',
    });
    const second = insertPost(db, {
      title: 'B',
      content: 'b',
      branch: 'main',
    });

    expect(second.id).toBeGreaterThan(first.id);
  });
});
