import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { getCommitDetail, listBranches, listCommits, listRepositories } from "../services/githubService";

const router = Router();

const asyncHandler = (
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
) => (request: Request, response: Response, next: NextFunction) => {
  void handler(request, response, next).catch(next);
};

router.get("/repositories", asyncHandler(async (_request, response) => {
  const repositories = await listRepositories();
  response.json({ repositories });
}));

router.get("/repositories/:owner/:repo/branches", asyncHandler(async (request, response) => {
  const { owner, repo } = request.params;
  const branches = await listBranches(owner, repo);
  response.json({ branches });
}));

router.get("/repositories/:owner/:repo/commits", asyncHandler(async (request, response) => {
  const { owner, repo } = request.params;
  const branch = String(request.query.branch ?? "");

  if (!branch) {
    response.status(400).json({
      code: "BRANCH_REQUIRED",
      message: "branch query parameter is required.",
    });
    return;
  }

  const commits = await listCommits(owner, repo, branch);
  response.json({ commits });
}));

router.get("/repositories/:owner/:repo/commits/:sha", asyncHandler(async (request, response) => {
  const { owner, repo, sha } = request.params;
  const commit = await getCommitDetail(owner, repo, sha);
  response.json({ commit });
}));

export { router as githubRoutes };
