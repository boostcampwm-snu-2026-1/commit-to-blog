import { Router } from 'express';
import { githubClient } from '../services/githubClient.js';

const router = Router();

router.get('/repos', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const repos = await githubClient.listRepos(q);
  res.json({ data: repos });
});

export default router;
