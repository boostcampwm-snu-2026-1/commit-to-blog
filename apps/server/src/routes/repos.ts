import { Router } from "express";
import { z } from "zod";
import type { ListReposResponse } from "@commit-to-blog/shared";
import { listRepos } from "../services/github/listRepos.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const QuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
});

export const reposRouter = Router();

reposRouter.get(
  "/repos",
  asyncHandler(async (req, res) => {
    const { q } = QuerySchema.parse(req.query);
    const repos = await listRepos(q);
    const body: ListReposResponse = { repos };
    res.json(body);
  }),
);

// week12 placeholders — 라우트만 잡아두고 stub 응답.
reposRouter.get("/repos/:owner/:repo/branches", (_req, res) => {
  res.json({ branches: [], notice: "week12 에서 구현 예정" });
});

reposRouter.get("/repos/:owner/:repo/commits", (_req, res) => {
  res.json({ commits: [], notice: "week12 에서 구현 예정" });
});
