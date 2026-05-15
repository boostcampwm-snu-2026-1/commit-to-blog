import { Router } from "express";

import { generateBlogDraft } from "../modules/blog/blog.service.js";

const blogRouter = Router();

blogRouter.post("/generate", async (request, response, next) => {
  try {
    const post = await generateBlogDraft(request.body);
    response.status(201).json({ post });
  } catch (error) {
    next(error);
  }
});

export default blogRouter;

