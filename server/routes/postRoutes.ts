import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { createPost, getPost, listPosts, updatePost, updatePostStatus } from "../services/postStore";
import type { BlogPostStatus, SavePostInput } from "../types/blog";

const router = Router();

const asyncHandler = (
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
) => (request: Request, response: Response, next: NextFunction) => {
  void handler(request, response, next).catch(next);
};

const parseSavePostInput = (body: unknown): SavePostInput | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  if (
    typeof candidate.title !== "string"
    || typeof candidate.summary !== "string"
    || typeof candidate.content !== "string"
    || typeof candidate.repositoryFullName !== "string"
    || typeof candidate.branchName !== "string"
    || !Array.isArray(candidate.commitShas)
    || !candidate.commitShas.every((sha) => typeof sha === "string")
  ) {
    return null;
  }

  return {
    title: candidate.title,
    summary: candidate.summary,
    content: candidate.content,
    repositoryFullName: candidate.repositoryFullName,
    branchName: candidate.branchName,
    commitShas: candidate.commitShas,
  };
};

const isPostStatus = (value: unknown): value is BlogPostStatus => value === "saved" || value === "published";

router.get("/", asyncHandler(async (_request, response) => {
  response.json({ posts: listPosts() });
}));

router.post("/", asyncHandler(async (request, response) => {
  const input = parseSavePostInput(request.body);

  if (!input) {
    response.status(400).json({
      code: "INVALID_POST_REQUEST",
      message: "title, summary, content, repositoryFullName, branchName, and commitShas are required.",
    });
    return;
  }

  response.status(201).json({ post: createPost(input) });
}));

router.get("/:id", asyncHandler(async (request, response) => {
  response.json({ post: getPost(request.params.id) });
}));

router.put("/:id", asyncHandler(async (request, response) => {
  const input = parseSavePostInput(request.body);

  if (!input) {
    response.status(400).json({
      code: "INVALID_POST_REQUEST",
      message: "title, summary, content, repositoryFullName, branchName, and commitShas are required.",
    });
    return;
  }

  response.json({ post: updatePost(request.params.id, input) });
}));

router.patch("/:id/status", asyncHandler(async (request, response) => {
  const status = (request.body as { status?: unknown } | null)?.status;

  if (!isPostStatus(status)) {
    response.status(400).json({
      code: "INVALID_POST_STATUS",
      message: "status must be saved or published.",
    });
    return;
  }

  response.json({ post: updatePostStatus(request.params.id, status) });
}));

export { router as postRoutes };
