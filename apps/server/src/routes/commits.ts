import { Router } from 'express';

export const commitsRouter = Router();

commitsRouter.get('/', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'GET /api/commits is not implemented yet.'
    }
  });
});
