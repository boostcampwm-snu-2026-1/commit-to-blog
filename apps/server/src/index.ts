import express from 'express';

import { commitsRouter } from './routes/commits';
import { diffRouter } from './routes/diff';
import { healthRouter } from './routes/health';
import { interviewRouter } from './routes/interview';
import { postsRouter } from './routes/posts';
import { reposRouter } from './routes/repos';

const app = express();

app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/repos', reposRouter);
app.use('/api/commits', commitsRouter);
app.use('/api/diff', diffRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/posts', postsRouter);

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on http://localhost:${port}`);
});
