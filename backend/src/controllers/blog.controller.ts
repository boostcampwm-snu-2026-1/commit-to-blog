import type { RequestHandler } from "express";

import {
  generateBlogDraft,
  type GeneratedDraft,
  parseGenerateDraftInput,
} from "../services/gemini.service.js";

type GenerateBlogResponse = {
  draft: GeneratedDraft;
};

export const generateBlogDraftHandler: RequestHandler = async (req, res) => {
  const draft = await generateBlogDraft(parseGenerateDraftInput(req.body));
  const response: GenerateBlogResponse = {
    draft: {
      title: draft.title,
      summary: draft.summary,
      content: draft.content,
    },
  };

  res.json(response);
};
