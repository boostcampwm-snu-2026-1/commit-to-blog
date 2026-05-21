import { Router } from "express";
import { z } from "zod";
import type {
  ListPostsResponse,
  Post,
  PublishExternalResponse,
} from "@commit-to-blog/shared";
import { postsService } from "../services/posts/postsService.js";
import { publishToGithubIssue } from "../services/posts/publishExternal.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const ListPostsQuery = z.object({
  status: z.enum(["draft", "published", "all"]).optional(),
  tag: z.string().min(1).max(60).optional(),
  q: z.string().min(1).max(200).optional(),
});

const PostSourceSchema = z.object({
  repoFullName: z
    .string()
    .regex(/^[^/]+\/[^/]+$/, "repoFullName 은 'owner/name' 형식이어야 합니다."),
  branch: z.string().min(1).max(200),
  commitShas: z
    .array(z.string().regex(/^[a-f0-9]{7,40}$/))
    .min(1)
    .max(10),
});

const TagsSchema = z.array(z.string().min(1).max(30)).max(20).optional();

const CreatePostBody = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  summary: z.string().min(1).max(500),
  source: PostSourceSchema,
  tags: TagsSchema,
});

const UpdatePostBody = z
  .object({
    title: z.string().min(1).max(200).optional(),
    body: z.string().min(1).optional(),
    summary: z.string().min(1).max(500).optional(),
    tags: TagsSchema,
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "수정할 필드를 하나 이상 보내주세요.",
  });

const PublishBody = z.object({
  publish: z.boolean(),
});

const PublishExternalBody = z.object({
  note: z.string().max(2000).optional(),
});

const PostIdParam = z.object({
  id: z.string().uuid(),
});

function filterAndSearch(
  posts: Post[],
  tag: string | undefined,
  q: string | undefined,
): Post[] {
  let out = posts;
  if (tag) {
    const needle = tag.toLowerCase();
    out = out.filter((p) => p.tags.includes(needle));
  }
  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.summary.toLowerCase().includes(needle) ||
        p.body.toLowerCase().includes(needle),
    );
  }
  return out;
}

export const postsRouter = Router();

postsRouter.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const { status, tag, q } = ListPostsQuery.parse(req.query);
    const all = await postsService.list(status);
    const posts = filterAndSearch(all, tag, q);
    const body: ListPostsResponse = { posts };
    res.json(body);
  }),
);

postsRouter.post(
  "/posts",
  asyncHandler(async (req, res) => {
    const body = CreatePostBody.parse(req.body);
    const post = await postsService.create(body);
    res.status(201).json({ post } satisfies { post: Post });
  }),
);

postsRouter.get(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const { id } = PostIdParam.parse(req.params);
    const post = await postsService.get(id);
    res.json({ post });
  }),
);

postsRouter.put(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const { id } = PostIdParam.parse(req.params);
    const patch = UpdatePostBody.parse(req.body);
    const post = await postsService.update(id, patch);
    res.json({ post });
  }),
);

postsRouter.patch(
  "/posts/:id/publish",
  asyncHandler(async (req, res) => {
    const { id } = PostIdParam.parse(req.params);
    const { publish } = PublishBody.parse(req.body);
    const post = await postsService.setPublished(id, publish);
    res.json({ post });
  }),
);

postsRouter.post(
  "/posts/:id/publish-external",
  asyncHandler(async (req, res) => {
    const { id } = PostIdParam.parse(req.params);
    const { note } = PublishExternalBody.parse(req.body);
    const target = await postsService.get(id);
    const url = await publishToGithubIssue(target, note);
    const post = await postsService.setExternalPublishedUrl(id, url);
    const body: PublishExternalResponse = { post, url };
    res.json(body);
  }),
);

postsRouter.delete(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const { id } = PostIdParam.parse(req.params);
    await postsService.delete(id);
    res.status(204).end();
  }),
);
