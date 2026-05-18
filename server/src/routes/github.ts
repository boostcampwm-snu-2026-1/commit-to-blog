import { Router } from 'express';
import { githubClient } from '../services/githubClient.js';

const router = Router();

router.get('/repos', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const repos = await githubClient.listRepos(q);
  res.json({ data: repos });
});

router.get('/branches', async (req, res) => {
  const repo = typeof req.query.repo === 'string' ? req.query.repo : '';
  const slash = repo.indexOf('/');
  if (slash <= 0 || slash === repo.length - 1) {
    res.status(400).json({
      error: { code: 'INVALID_REPO', message: 'repo must be "owner/name"' },
    });
    return;
  }
  const branches = await githubClient.listBranches(repo);
  res.json({ data: branches });
});

export default router;
