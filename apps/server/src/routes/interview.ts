import { Router } from 'express';

export const interviewRouter = Router();

interviewRouter.post('/start', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/interview/start is not implemented yet.'
    }
  });
});

interviewRouter.post('/:sessionId/answer', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/interview/:sessionId/answer is not implemented yet.'
    }
  });
});

interviewRouter.post('/:sessionId/hint', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/interview/:sessionId/hint is not implemented yet.'
    }
  });
});

interviewRouter.post('/:sessionId/explain', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/interview/:sessionId/explain is not implemented yet.'
    }
  });
});

interviewRouter.post('/:sessionId/skip', (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'POST /api/interview/:sessionId/skip is not implemented yet.'
    }
  });
});
