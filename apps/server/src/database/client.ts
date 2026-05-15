import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { env } from "../config/env.js";

mkdirSync(dirname(env.databasePath), { recursive: true });

export const db = new Database(env.databasePath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    repository_owner TEXT NOT NULL,
    repository_name TEXT NOT NULL,
    branch TEXT NOT NULL,
    commit_shas_json TEXT NOT NULL,
    source_commits_json TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    generation_mode TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_posts_updated_at
  ON posts(updated_at DESC);
`);

