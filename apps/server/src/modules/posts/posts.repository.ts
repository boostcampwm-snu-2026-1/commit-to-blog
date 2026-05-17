import { db } from "../../database/client.js";
import type { PostRecord } from "../../types.js";

interface PostRow {
  id: string;
  repository_owner: string;
  repository_name: string;
  branch: string;
  commit_shas_json: string;
  source_commits_json: string;
  title: string;
  summary: string;
  content: string;
  status: PostRecord["status"];
  generation_mode: PostRecord["generationMode"];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const selectAllPostsStatement = db.prepare(`
  SELECT *
  FROM posts
  ORDER BY updated_at DESC
`);

const selectPostByIdStatement = db.prepare(`
  SELECT *
  FROM posts
  WHERE id = ?
`);

const insertPostStatement = db.prepare(`
  INSERT INTO posts (
    id,
    repository_owner,
    repository_name,
    branch,
    commit_shas_json,
    source_commits_json,
    title,
    summary,
    content,
    status,
    generation_mode,
    created_at,
    updated_at,
    published_at
  ) VALUES (
    @id,
    @repository_owner,
    @repository_name,
    @branch,
    @commit_shas_json,
    @source_commits_json,
    @title,
    @summary,
    @content,
    @status,
    @generation_mode,
    @created_at,
    @updated_at,
    @published_at
  )
`);

const replacePostStatement = db.prepare(`
  INSERT OR REPLACE INTO posts (
    id,
    repository_owner,
    repository_name,
    branch,
    commit_shas_json,
    source_commits_json,
    title,
    summary,
    content,
    status,
    generation_mode,
    created_at,
    updated_at,
    published_at
  ) VALUES (
    @id,
    @repository_owner,
    @repository_name,
    @branch,
    @commit_shas_json,
    @source_commits_json,
    @title,
    @summary,
    @content,
    @status,
    @generation_mode,
    @created_at,
    @updated_at,
    @published_at
  )
`);

function mapRow(row: PostRow): PostRecord {
  return {
    id: row.id,
    repositoryOwner: row.repository_owner,
    repositoryName: row.repository_name,
    branch: row.branch,
    commitShas: JSON.parse(row.commit_shas_json),
    sourceCommits: JSON.parse(row.source_commits_json),
    title: row.title,
    summary: row.summary,
    content: row.content,
    status: row.status,
    generationMode: row.generation_mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at
  };
}

function mapPost(record: PostRecord) {
  return {
    id: record.id,
    repository_owner: record.repositoryOwner,
    repository_name: record.repositoryName,
    branch: record.branch,
    commit_shas_json: JSON.stringify(record.commitShas),
    source_commits_json: JSON.stringify(record.sourceCommits),
    title: record.title,
    summary: record.summary,
    content: record.content,
    status: record.status,
    generation_mode: record.generationMode,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    published_at: record.publishedAt
  };
}

export function listAllPosts() {
  return (selectAllPostsStatement.all() as PostRow[]).map(mapRow);
}

export function findPostById(id: string) {
  const row = selectPostByIdStatement.get(id) as PostRow | undefined;
  return row ? mapRow(row) : null;
}

export function insertPost(record: PostRecord) {
  insertPostStatement.run(mapPost(record));
  return record;
}

export function replacePost(record: PostRecord) {
  replacePostStatement.run(mapPost(record));
  return record;
}

