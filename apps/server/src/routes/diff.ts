import { Router } from 'express';

export const diffRouter = Router();

diffRouter.get('/', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'GET /api/diff is not implemented yet.'
    }
  });
});
