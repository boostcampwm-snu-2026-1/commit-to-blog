import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { healthzRouter } from "./routes/healthz.js";
import { reposRouter } from "./routes/repos.js";
import { draftsRouter } from "./routes/drafts.js";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  app.use(healthzRouter);
  app.use("/api", reposRouter);
  app.use("/api", draftsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
