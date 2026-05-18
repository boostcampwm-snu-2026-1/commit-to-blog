import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { createBlogDraft } from "../services/llmService";
import type { CreateDraftRequest } from "../types/blog";

const router = Router();

const asyncHandler = (
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
) => (request: Request, response: Response, next: NextFunction) => {
  void handler(request, response, next).catch(next);
};

const isLanguage = (value: unknown): value is CreateDraftRequest["language"] => (
  value === undefined || value === "ko" || value === "en"
);

const parseCreateDraftRequest = (body: unknown): CreateDraftRequest | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  if (
    typeof candidate.repositoryFullName !== "string"
    || typeof candidate.branchName !== "string"
    || !Array.isArray(candidate.commitShas)
    || !candidate.commitShas.every((sha) => typeof sha === "string")
    || !isLanguage(candidate.language)
  ) {
    return null;
  }

  return {
    repositoryFullName: candidate.repositoryFullName,
    branchName: candidate.branchName,
    commitShas: candidate.commitShas,
    language: candidate.language,
  };
};

router.post("/drafts", asyncHandler(async (request, response) => {
  const draftRequest = parseCreateDraftRequest(request.body);

  if (!draftRequest) {
    response.status(400).json({
      code: "INVALID_DRAFT_REQUEST",
      message: "repositoryFullName, branchName, and commitShas are required.",
    });
    return;
  }

  const draft = await createBlogDraft(draftRequest);
  response.status(201).json({ draft });
}));

export { router as llmRoutes };
