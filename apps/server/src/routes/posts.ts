import { Router } from 'express';

export const postsRouter = Router();

postsRouter.post('/', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/posts is not implemented yet.'
    }
  });
});

postsRouter.get('/', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'GET /api/posts is not implemented yet.'
    }
  });
});
