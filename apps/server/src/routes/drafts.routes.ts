import { Router } from "express";
import { z } from "zod";
import {
  createDraft,
  deleteDraft,
  getDraft,
  listDrafts,
  updateDraft,
} from "../services/drafts.service.js";

const createSchema = z.object({
  repo: z.string().regex(/^[^/]+\/[^/]+$/),
  branch: z.string().min(1),
  commitShas: z.array(z.string().min(7)).min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentMd: z.string().min(1),
  status: z.enum(["draft", "published"]).default("draft"),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  contentMd: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const draftsRouter = Router();

draftsRouter.get("/", async (_req, res, next) => {
  try {
    res.json(await listDrafts());
  } catch (err) {
    next(err);
  }
});

draftsRouter.get("/:id", async (req, res, next) => {
  try {
    const draft = await getDraft(req.params.id);
    if (!draft) {
      res.status(404).json({ error: "Draft not found" });
      return;
    }
    res.json(draft);
  } catch (err) {
    next(err);
  }
});

draftsRouter.post("/", async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    res.status(201).json(await createDraft(body));
  } catch (err) {
    next(err);
  }
});

draftsRouter.patch("/:id", async (req, res, next) => {
  try {
    const patch = updateSchema.parse(req.body);
    const updated = await updateDraft(req.params.id, patch);
    if (!updated) {
      res.status(404).json({ error: "Draft not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

draftsRouter.delete("/:id", async (req, res, next) => {
  try {
    const ok = await deleteDraft(req.params.id);
    if (!ok) {
      res.status(404).json({ error: "Draft not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
