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

router.get('/commits', async (req, res) => {
  const repo = typeof req.query.repo === 'string' ? req.query.repo : '';
  const branch = typeof req.query.branch === 'string' ? req.query.branch : '';
  const slash = repo.indexOf('/');
  if (slash <= 0 || slash === repo.length - 1) {
    res.status(400).json({
      error: { code: 'INVALID_REPO', message: 'repo must be "owner/name"' },
    });
    return;
  }
  if (!branch) {
    res.status(400).json({
      error: { code: 'INVALID_BRANCH', message: 'branch is required' },
    });
    return;
  }
  const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 20;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100 ? limitRaw : 20;
  const commits = await githubClient.listCommits(repo, branch, limit);
  res.json({ data: commits });
});

export default router;
