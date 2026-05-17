import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/blog.db');

const db = new Database(DB_PATH);

// WAL 모드: 읽기/쓰기 동시성 향상
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    summary     TEXT    NOT NULL DEFAULT '',
    branch      TEXT    NOT NULL DEFAULT '',
    commit_sha  TEXT    NOT NULL DEFAULT '',
    repo_name   TEXT    NOT NULL DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'draft',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
