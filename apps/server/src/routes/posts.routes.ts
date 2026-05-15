import { Router } from "express";
import { z } from "zod";

import { getSavedPost, listSavedPosts, publishPost, savePostEdits } from "../modules/posts/posts.service.js";

const postIdSchema = z.object({
  postId: z.string().uuid()
});

const postsRouter = Router();

postsRouter.get("/", (_request, response) => {
  const posts = listSavedPosts();
  response.json({ posts });
});

postsRouter.get("/:postId", (request, response) => {
  const { postId } = postIdSchema.parse(request.params);
  const post = getSavedPost(postId);

  if (!post) {
    response.status(404).json({ message: "포스트를 찾을 수 없습니다." });
    return;
  }

  response.json({ post });
});

postsRouter.put("/:postId", (request, response) => {
  const { postId } = postIdSchema.parse(request.params);
  const post = savePostEdits(postId, request.body);

  if (!post) {
    response.status(404).json({ message: "포스트를 찾을 수 없습니다." });
    return;
  }

  response.json({ post });
});

postsRouter.post("/:postId/publish", (request, response) => {
  const { postId } = postIdSchema.parse(request.params);
  const post = publishPost(postId);

  if (!post) {
    response.status(404).json({ message: "포스트를 찾을 수 없습니다." });
    return;
  }

  response.json({ post });
});

export default postsRouter;

