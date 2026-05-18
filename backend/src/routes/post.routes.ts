import { Router } from "express";

import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
  updatePostHandler,
  updatePostStatusHandler,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.get("/", listPostsHandler);
postRouter.get("/:id", getPostHandler);
postRouter.post("/", createPostHandler);
postRouter.patch("/:id", updatePostHandler);
postRouter.patch("/:id/status", updatePostStatusHandler);
postRouter.delete("/:id", deletePostHandler);

export default postRouter;
