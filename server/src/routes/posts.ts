import { Router, Request, Response } from 'express';
import db from '../db';
import { Post } from '../types';

const router = Router();

// GET /api/posts — 전체 목록 (최신순)
router.get('/', (_req: Request, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT * FROM posts ORDER BY created_at DESC
    `).all() as Post[];
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/posts — 새 포스트 저장
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, content, summary, branch, commit_sha, repo_name, status } =
      req.body as Partial<Post>;

    if (!title || !content) {
      res.status(400).json({ error: 'title과 content는 필수입니다.' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO posts (title, content, summary, branch, commit_sha, repo_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      content,
      summary ?? '',
      branch ?? '',
      commit_sha ?? '',
      repo_name ?? '',
      status ?? 'draft'
    );

    const created = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid) as Post;
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/posts/:id — 포스트 수정
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;

    if (!existing) {
      res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
      return;
    }

    const { title, content, summary, branch, commit_sha, repo_name, status } =
      req.body as Partial<Post>;

    db.prepare(`
      UPDATE posts
      SET title      = ?,
          content    = ?,
          summary    = ?,
          branch     = ?,
          commit_sha = ?,
          repo_name  = ?,
          status     = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(
      title      ?? existing.title,
      content    ?? existing.content,
      summary    ?? existing.summary,
      branch     ?? existing.branch,
      commit_sha ?? existing.commit_sha,
      repo_name  ?? existing.repo_name,
      status     ?? existing.status,
      id
    );

    const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /api/posts/:id — 포스트 삭제
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);

    if (!existing) {
      res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
      return;
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
