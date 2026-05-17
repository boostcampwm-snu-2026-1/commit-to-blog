import { Router } from "express";

import { generateBlogDraftHandler } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post("/generate", generateBlogDraftHandler);

export default blogRouter;
