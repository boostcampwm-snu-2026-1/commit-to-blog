import express from 'express';
import { env } from './env.js';
import healthRouter from './routes/health.js';

const app = express();

app.use(express.json());
app.use('/api', healthRouter);

app.listen(env.PORT, () => {
  console.log(`server listening on :${env.PORT}`);
});
