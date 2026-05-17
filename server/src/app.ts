import express from 'express';
import githubRouter from './routes/github.js';
import aiRouter from './routes/ai.js';
import postsRouter from './routes/posts.js';

const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/github', githubRouter);
app.use('/api/ai', aiRouter);
app.use('/api/posts', postsRouter);

export default app;
