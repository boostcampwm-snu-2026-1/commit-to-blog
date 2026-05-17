import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { MissingGithubTokenError, getCommitDetail } from '../github.js';
import { MissingGeminiKeyError, generateDraft } from '../services/ai.js';

const router = Router();

const draftBodySchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().min(1),
  commits: z.array(z.string().min(1)).min(1),
});

interface OctokitLikeError {
  status?: number;
  message?: string;
  response?: { headers?: Record<string, string | undefined> };
}

function handleDraftError(err: unknown, res: Response): void {
  if (err instanceof MissingGithubTokenError) {
    res.status(500).json({ error: 'GITHUB_TOKEN not set' });
    return;
  }
  if (err instanceof MissingGeminiKeyError) {
    res.status(500).json({ error: 'GEMINI_API_KEY not set' });
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
      : 'external API error';
  res.status(502).json({ error: message });
}

router.post('/draft', async (req: Request, res: Response) => {
  const parsed = draftBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? 'invalid request body' });
    return;
  }
  const { owner, repo, commits } = parsed.data;

  try {
    const details = await Promise.all(
      commits.map((sha) => getCommitDetail(owner, repo, sha)),
    );
    const markdown = await generateDraft(details);
    res.json({ markdown });
  } catch (err) {
    handleDraftError(err, res);
  }
});

export default router;
