import { Router } from "express";
import { z } from "zod";

import { listBranches, listCommits, listRepositories } from "../modules/github/github.service.js";

const repositoryParamsSchema = z.object({
  owner: z.string().trim().min(1),
  repo: z.string().trim().min(1)
});

const branchQuerySchema = z.object({
  branch: z.string().trim().min(1)
});

const githubRouter = Router();

githubRouter.get("/repositories", async (_request, response, next) => {
  try {
    const repositories = await listRepositories();
    response.json({ repositories });
  } catch (error) {
    next(error);
  }
});

githubRouter.get("/:owner/:repo/branches", async (request, response, next) => {
  try {
    const { owner, repo } = repositoryParamsSchema.parse(request.params);
    const branches = await listBranches(owner, repo);
    response.json({ branches });
  } catch (error) {
    next(error);
  }
});

githubRouter.get("/:owner/:repo/commits", async (request, response, next) => {
  try {
    const { owner, repo } = repositoryParamsSchema.parse(request.params);
    const { branch } = branchQuerySchema.parse(request.query);
    const commits = await listCommits(owner, repo, branch);
    response.json({ commits });
  } catch (error) {
    next(error);
  }
});

export default githubRouter;

