const express = require('express');
const router = express.Router();
const db = require('../services/dbService');

router.get('/', (req, res) => res.json(db.getAllPosts()));

router.get('/:id', (req, res) => {
  const post = db.getPostById(Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

router.post('/', (req, res) => {
  const { title, body, summary, repoName, repo_name, branch, commits, tags } = req.body;
  const id = db.createPost({ title, body, summary, repoName: repoName || repo_name, branch, commits, tags });
  res.status(201).json({ id });
});

router.put('/:id', (req, res) => {
  db.updatePost(Number(req.params.id), req.body);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.deletePost(Number(req.params.id));
  res.json({ success: true });
});

router.post('/:id/publish', (req, res) => {
  db.publishPost(Number(req.params.id));
  res.json({ success: true });
});

module.exports = router;
