import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubRouter from './routes/github';
import postsRouter from './routes/posts';
import generateRouter from './routes/generate';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/github', githubRouter);
app.use('/api/posts', postsRouter);
app.use('/api/generate', generateRouter);

export default app;
