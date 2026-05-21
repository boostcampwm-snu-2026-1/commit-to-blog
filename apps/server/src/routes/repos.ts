import { Router } from "express";
import { z } from "zod";
import type {
  ListBranchesResponse,
  ListCommitsResponse,
  ListReposResponse,
} from "@commit-to-blog/shared";
import { listRepos } from "../services/github/listRepos.js";
import { listBranches } from "../services/github/listBranches.js";
import { listCommits } from "../services/github/listCommits.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const ListReposQuery = z.object({
  q: z.string().min(1).max(200).optional(),
});

const OwnerRepoParams = z.object({
  owner: z.string().min(1).regex(/^[^/]+$/, "owner must not contain '/'"),
  repo: z.string().min(1).regex(/^[^/]+$/, "repo must not contain '/'"),
});

const ListCommitsQuery = z.object({
  branch: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const reposRouter = Router();

reposRouter.get(
  "/repos",
  asyncHandler(async (req, res) => {
    const { q } = ListReposQuery.parse(req.query);
    const repos = await listRepos(q);
    const body: ListReposResponse = { repos };
    res.json(body);
  }),
);

reposRouter.get(
  "/repos/:owner/:repo/branches",
  asyncHandler(async (req, res) => {
    const { owner, repo } = OwnerRepoParams.parse(req.params);
    const branches = await listBranches(owner, repo);
    const body: ListBranchesResponse = { branches };
    res.json(body);
  }),
);

reposRouter.get(
  "/repos/:owner/:repo/commits",
  asyncHandler(async (req, res) => {
    const { owner, repo } = OwnerRepoParams.parse(req.params);
    const { branch, limit } = ListCommitsQuery.parse(req.query);
    const commits = await listCommits(owner, repo, branch, limit);
    const body: ListCommitsResponse = { commits };
    res.json(body);
  }),
);
