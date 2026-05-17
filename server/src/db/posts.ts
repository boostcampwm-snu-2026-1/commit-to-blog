import type Database from 'better-sqlite3';

export type PostStatus = 'draft' | 'published';

export interface PostRow {
  id: number;
  title: string;
  content: string;
  branch: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface InsertPostInput {
  title: string;
  content: string;
  branch: string;
  status?: PostStatus;
}

/**
 * Create the posts table and its updated_at trigger if they do not exist.
 * Idempotent — safe to call on every db open.
 */
export function initPostsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      branch TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TRIGGER IF NOT EXISTS posts_set_updated_at
    AFTER UPDATE ON posts
    FOR EACH ROW
    BEGIN
      UPDATE posts
      SET updated_at = datetime('now')
      WHERE id = OLD.id;
    END;
  `);
}

/**
 * Insert a new post and return the fully populated row (with defaults filled in
 * by sqlite, e.g. status / created_at / updated_at).
 */
export function insertPost(
  db: Database.Database,
  input: InsertPostInput,
): PostRow {
  const status: PostStatus = input.status ?? 'draft';
  const result = db
    .prepare(
      `INSERT INTO posts (title, content, branch, status)
       VALUES (@title, @content, @branch, @status)`,
    )
    .run({
      title: input.title,
      content: input.content,
      branch: input.branch,
      status,
    });

  const row = db
    .prepare(`SELECT * FROM posts WHERE id = ?`)
    .get(result.lastInsertRowid) as PostRow | undefined;

  if (!row) {
    throw new Error('insertPost: row not found after insert');
  }
  return row;
}
