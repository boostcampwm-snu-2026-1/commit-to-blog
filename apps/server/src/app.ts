import express from "express";
import cors from "cors";
import { githubRouter } from "./routes/github.routes.js";
import { summarizeRouter } from "./routes/summarize.routes.js";
import { draftsRouter } from "./routes/drafts.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/github", githubRouter);
  app.use("/api/summarize", summarizeRouter);
  app.use("/api/drafts", draftsRouter);

  app.use(errorHandler);
  return app;
}
