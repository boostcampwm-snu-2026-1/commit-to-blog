const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/posts.db');
let db = null;

function getDb() {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
  }
  return db;
}

function initDb() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      repo_name TEXT NOT NULL,
      branch TEXT NOT NULL,
      commits_json TEXT NOT NULL DEFAULT '[]',
      tags_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      published INTEGER NOT NULL DEFAULT 0
    )
  `);
  console.log('SQLite DB initialized at', DB_PATH);
}

function parsePost(row) {
  return { ...row, commits: JSON.parse(row.commits_json), tags: JSON.parse(row.tags_json), published: row.published === 1 };
}

function getAllPosts() { return getDb().prepare('SELECT * FROM posts ORDER BY created_at DESC').all().map(parsePost); }
function getPostById(id) { const r = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id); return r ? parsePost(r) : null; }
function createPost({ title, body, summary, repoName, branch, commits = [], tags = [] }) {
  return getDb().prepare('INSERT INTO posts (title, body, summary, repo_name, branch, commits_json, tags_json) VALUES (?,?,?,?,?,?,?)')
    .run(title, body || '', summary || '', repoName, branch, JSON.stringify(commits), JSON.stringify(tags)).lastInsertRowid;
}
function updatePost(id, { title, body, summary, tags }) {
  getDb().prepare("UPDATE posts SET title=?, body=?, summary=?, tags_json=?, updated_at=datetime('now') WHERE id=?")
    .run(title, body || '', summary || '', JSON.stringify(tags || []), id);
}
function deletePost(id) { getDb().prepare('DELETE FROM posts WHERE id = ?').run(id); }
function publishPost(id) { getDb().prepare("UPDATE posts SET published=1, updated_at=datetime('now') WHERE id=?").run(id); }

module.exports = { initDb, getAllPosts, getPostById, createPost, updatePost, deletePost, publishPost };
