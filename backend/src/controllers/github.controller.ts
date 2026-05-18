import type { RequestHandler } from "express";

import {
  listBranches,
  listCommits,
  listRepositories,
} from "../services/github.service.js";
import { HttpError } from "../middleware/error.middleware.js";

function readSingleString(value: unknown) {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function requireSingleString(value: unknown, field: string) {
  const result = readSingleString(value);

  if (!result || result.trim() === "") {
    throw new HttpError(400, `Missing required parameter: ${field}`);
  }

  return result;
}

export const listRepositoriesHandler: RequestHandler = async (_req, res) => {
  const repositories = await listRepositories();

  res.json(repositories);
};

export const listBranchesHandler: RequestHandler = async (req, res) => {
  const owner = requireSingleString(req.params.owner, "owner");
  const repo = requireSingleString(req.params.repo, "repo");

  const branches = await listBranches(owner, repo);

  res.json(branches);
};

export const listCommitsHandler: RequestHandler = async (req, res) => {
  const owner = requireSingleString(req.params.owner, "owner");
  const repo = requireSingleString(req.params.repo, "repo");
  const branch = requireSingleString(req.query.branch, "branch");

  const commits = await listCommits(owner, repo, branch);

  res.json(commits);
};
