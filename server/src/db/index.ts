import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { initPostsTable } from './posts.js';

type DatabaseInstance = Database.Database;

const dbCache = new Map<string, DatabaseInstance>();

function resolveDbPath(): string {
  return process.env.DATABASE_PATH ?? './data/blog.db';
}

/**
 * Get (or create) a better-sqlite3 instance for the current DATABASE_PATH.
 *
 * The env var is read on every call so that tests can swap DATABASE_PATH
 * between cases. Instances are cached per-path so the same logical db is
 * reused across callers. The posts table is initialized once per cache key.
 */
export function getDb(): DatabaseInstance {
  const dbPath = resolveDbPath();

  const cached = dbCache.get(dbPath);
  if (cached) {
    return cached;
  }

  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (dir && dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(dbPath);
  initPostsTable(db);
  dbCache.set(dbPath, db);
  return db;
}

/**
 * Close every cached db instance and forget them. Intended for test cleanup.
 */
export function closeDb(): void {
  for (const db of dbCache.values()) {
    db.close();
  }
  dbCache.clear();
}
