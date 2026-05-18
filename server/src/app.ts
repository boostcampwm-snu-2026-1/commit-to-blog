import express from 'express';
import healthRouter from './routes/health.js';
import githubRouter from './routes/github.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api', healthRouter);
  app.use('/api/github', githubRouter);

  return app;
}
