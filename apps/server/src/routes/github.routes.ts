import { Router } from "express";
import { z } from "zod";
import {
  getCommitDetail,
  listBranches,
  listCommits,
  listRepos,
} from "../services/github.service.js";

const repoParamSchema = z.object({
  repo: z.string().regex(/^[^/]+\/[^/]+$/, "repo must be 'owner/name'"),
});

function splitRepo(repo: string): [string, string] {
  const [owner, name] = repo.split("/");
  return [owner!, name!];
}

export const githubRouter = Router();

githubRouter.get("/repos", async (_req, res, next) => {
  try {
    res.json(await listRepos());
  } catch (err) {
    next(err);
  }
});

githubRouter.get("/branches", async (req, res, next) => {
  try {
    const { repo } = repoParamSchema.parse(req.query);
    const [owner, name] = splitRepo(repo);
    res.json(await listBranches(owner, name));
  } catch (err) {
    next(err);
  }
});

const commitsQuerySchema = repoParamSchema.extend({
  branch: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

githubRouter.get("/commits", async (req, res, next) => {
  try {
    const { repo, branch, limit } = commitsQuerySchema.parse(req.query);
    const [owner, name] = splitRepo(repo);
    res.json(await listCommits(owner, name, branch, limit));
  } catch (err) {
    next(err);
  }
});

const commitDetailQuerySchema = repoParamSchema.extend({
  sha: z.string().min(7),
});

githubRouter.get("/commit", async (req, res, next) => {
  try {
    const { repo, sha } = commitDetailQuerySchema.parse(req.query);
    const [owner, name] = splitRepo(repo);
    res.json(await getCommitDetail(owner, name, sha));
  } catch (err) {
    next(err);
  }
});
