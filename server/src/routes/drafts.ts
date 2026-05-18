import { Router } from 'express';
import { z } from 'zod';
import { githubClient } from '../services/githubClient.js';
import { claudeClient } from '../services/claudeClient.js';
import { draftStore } from '../services/draftStore.js';
import { buildBlogDraftPrompt } from '../prompts/blogDraftPrompt.js';

const router = Router();

const generateBodySchema = z.object({
  repo: z.string().regex(/^[^/]+\/[^/]+$/, 'repo must be "owner/name"'),
  branch: z.string().min(1, 'branch is required'),
  sha: z.string().min(1, 'sha is required'),
});

const blogDraftSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
});

function parseDraftJson(raw: string): z.infer<typeof blogDraftSchema> | null {
  const candidates: string[] = [raw.trim()];

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch?.[1]) candidates.push(fenceMatch[1].trim());

  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(raw.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed: unknown = JSON.parse(candidate);
      const result = blogDraftSchema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      // try next candidate
    }
  }

  return null;
}

router.post('/generate', async (req, res) => {
  const bodyResult = generateBodySchema.safeParse(req.body);
  if (!bodyResult.success) {
    const first = bodyResult.error.issues[0];
    res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: first ? `${first.path.join('.') || '(root)'}: ${first.message}` : 'invalid input',
      },
    });
    return;
  }

  const { repo, branch, sha } = bodyResult.data;

  const commit = await githubClient.getCommit(repo, sha);
  const prompt = buildBlogDraftPrompt({ repo, branch, commit });
  const raw = await claudeClient.complete(prompt);

  const parsed = parseDraftJson(raw);
  if (!parsed) {
    res.status(502).json({
      error: {
        code: 'LLM_PARSE_FAILED',
        message: 'failed to parse blog draft from LLM response',
      },
    });
    return;
  }

  const draft = draftStore.create({
    repo,
    branch,
    commitSha: sha,
    title: parsed.title,
    summary: parsed.summary,
    body: parsed.body,
  });

  res.status(201).json({ data: draft });
});

export default router;
