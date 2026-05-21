import { Router } from "express";
import { z } from "zod";
import type { CreateDraftResponse } from "@commit-to-blog/shared";
import { createDraft } from "../services/llm/createDraft.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const CreateDraftBody = z.object({
  repoFullName: z
    .string()
    .min(1)
    .regex(/^[^/]+\/[^/]+$/, "repoFullName 은 'owner/name' 형식이어야 합니다."),
  branch: z.string().min(1).max(200),
  commitShas: z
    .array(z.string().regex(/^[a-f0-9]{7,40}$/, "유효한 sha 형식이 아닙니다."))
    .min(1)
    .max(10),
});

export const draftsRouter = Router();

draftsRouter.post(
  "/posts/draft",
  asyncHandler(async (req, res) => {
    const body = CreateDraftBody.parse(req.body);
    const draft = await createDraft({
      repoFullName: body.repoFullName,
      branch: body.branch,
      commitShas: body.commitShas,
    });
    const responseBody: CreateDraftResponse = { draft };
    res.json(responseBody);
  }),
);
