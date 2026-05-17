import type { RequestHandler } from "express";

import {
  generateBlogDraft,
  parseGenerateDraftInput,
} from "../services/gemini.service.js";

export const generateBlogDraftHandler: RequestHandler = async (req, res) => {
  const draft = await generateBlogDraft(parseGenerateDraftInput(req.body));

  res.json({ draft });
};
