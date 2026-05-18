import express from 'express';
import { env } from './env.js';
import healthRouter from './routes/health.js';
import githubRouter from './routes/github.js';

const app = express();

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api/github', githubRouter);

app.listen(env.PORT, () => {
  console.log(`server listening on :${env.PORT}`);
});
