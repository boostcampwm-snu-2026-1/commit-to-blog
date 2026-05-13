import { Router } from "express";
import { hasGithubToken, hasOpenAiKey } from "../config/env.js";

const start = Date.now();

export const healthzRouter = Router();

healthzRouter.get("/healthz", (_req, res) => {
  res.json({
    ok: true,
    version: "0.1.0",
    uptimeMs: Date.now() - start,
    env: {
      githubToken: hasGithubToken(),
      openaiKey: hasOpenAiKey(),
    },
  });
});
