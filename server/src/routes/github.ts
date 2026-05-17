import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import {
  MissingGithubTokenError,
  listBranches,
  listCommits,
  listRepos,
} from '../github.js';

const router = Router();

const repoParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const commitsQuerySchema = z.object({
  branch: z.string().min(1, 'branch query is required'),
});

interface OctokitLikeError {
  status?: number;
  message?: string;
  response?: { headers?: Record<string, string | undefined> };
}

function handleGithubError(err: unknown, res: Response): void {
  if (err instanceof MissingGithubTokenError) {
    res.status(500).json({ error: 'GITHUB_TOKEN not set' });
    return;
  }

  const e = err as OctokitLikeError;
  const status = typeof e?.status === 'number' ? e.status : undefined;
  const headers = e?.response?.headers ?? {};
  const remaining = headers['x-ratelimit-remaining'];

  if (status === 403 && remaining === '0') {
    res.status(429).json({ error: 'GitHub API rate limit exceeded' });
    return;
  }

  const message =
    typeof e?.message === 'string' && e.message.length > 0
      ? e.message
      : 'GitHub API error';
  res.status(502).json({ error: message });
}

router.get('/repos', async (_req: Request, res: Response) => {
  try {
    const repos = await listRepos();
    res.json(repos);
  } catch (err) {
    handleGithubError(err, res);
  }
});

router.get('/repos/:owner/:repo/branches', async (req: Request, res: Response) => {
  const parsedParams = repoParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({ error: 'invalid owner or repo' });
    return;
  }
  const { owner, repo } = parsedParams.data;
  try {
    const branches = await listBranches(owner, repo);
    res.json(branches);
  } catch (err) {
    handleGithubError(err, res);
  }
});

router.get('/repos/:owner/:repo/commits', async (req: Request, res: Response) => {
  const parsedParams = repoParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({ error: 'invalid owner or repo' });
    return;
  }
  const parsedQuery = commitsQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ error: 'branch query is required' });
    return;
  }
  const { owner, repo } = parsedParams.data;
  const { branch } = parsedQuery.data;
  try {
    const commits = await listCommits(owner, repo, branch);
    res.json(commits);
  } catch (err) {
    handleGithubError(err, res);
  }
});

export default router;
