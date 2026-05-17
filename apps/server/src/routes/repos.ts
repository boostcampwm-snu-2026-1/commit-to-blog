import { Router } from 'express';

export const reposRouter = Router();

reposRouter.get('/', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'GET /api/repos is not implemented yet.'
    }
  });
});
