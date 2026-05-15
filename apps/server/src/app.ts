import cors from "cors";
import express from "express";
import { ZodError } from "zod";

import { integrationMode } from "./config/env.js";
import blogRouter from "./routes/blog.routes.js";
import githubRouter from "./routes/github.routes.js";
import postsRouter from "./routes/posts.routes.js";

export const app = express();

app.use(
  cors({
    origin: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/meta", (_request, response) => {
  response.json({
    githubMode: integrationMode.github,
    openAIMode: integrationMode.openAI,
    storage: "sqlite"
  });
});

app.use("/api/github", githubRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/posts", postsRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "요청한 API 경로를 찾을 수 없습니다." });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "요청 형식이 올바르지 않습니다.",
      issues: error.flatten()
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: error instanceof Error ? error.message : "서버 오류가 발생했습니다."
  });
});

