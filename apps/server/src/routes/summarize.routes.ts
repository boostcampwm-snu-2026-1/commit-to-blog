import { Router } from "express";
import { z } from "zod";
import { summarizeCommits } from "../services/llm.service.js";

const fileSchema = z.object({
  filename: z.string(),
  status: z.enum(["added", "modified", "removed", "renamed"]),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  patch: z.string().optional(),
});

const commitSchema = z.object({
  sha: z.string().min(7),
  message: z.string(),
  body: z.string().optional(),
  files: z.array(fileSchema),
  stats: z.object({
    additions: z.number().int().nonnegative(),
    deletions: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
});

const requestSchema = z.object({
  repo: z.string().regex(/^[^/]+\/[^/]+$/),
  branch: z.string().min(1),
  commits: z.array(commitSchema).min(1).max(10),
  style: z.enum(["default", "short", "technical", "casual"]).optional(),
});

export const summarizeRouter = Router();

summarizeRouter.post("/", async (req, res, next) => {
  try {
    const body = requestSchema.parse(req.body);
    res.json(await summarizeCommits(body));
  } catch (err) {
    next(err);
  }
});
