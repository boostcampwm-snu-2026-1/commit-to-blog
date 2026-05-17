import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import { githubRoutes } from "./routes/githubRoutes";
import { GitHubServiceError } from "./services/githubService";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/github", githubRoutes);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof GitHubServiceError) {
    response.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unexpected server error.",
  });
});

app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`);
});
