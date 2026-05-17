import express from 'express';
import githubRouter from './routes/github.js';

const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/github', githubRouter);

export default app;
