import { Router } from "express";

import {
  listBranchesHandler,
  listCommitsHandler,
  listRepositoriesHandler,
} from "../controllers/github.controller.js";

const githubRouter = Router();

githubRouter.get("/repos", listRepositoriesHandler);
githubRouter.get("/repos/:owner/:repo/branches", listBranchesHandler);
githubRouter.get("/repos/:owner/:repo/commits", listCommitsHandler);

export default githubRouter;
