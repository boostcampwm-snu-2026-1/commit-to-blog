import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { insertPost } from '../db/posts.js';

const router = Router();

const createPostBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  branch: z.string().min(1),
  status: z.enum(['draft', 'published']).optional(),
});

router.post('/', (req: Request, res: Response) => {
  const parsed = createPostBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message ?? 'invalid request body',
    });
    return;
  }

  try {
    const db = getDb();
    const row = insertPost(db, parsed.data);
    res.status(201).json(row);
  } catch (err) {
    const message =
      err instanceof Error && err.message.length > 0
        ? err.message
        : 'database error';
    res.status(500).json({ error: message });
  }
});

export default router;
