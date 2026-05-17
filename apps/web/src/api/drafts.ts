import { api } from "./client";
import type { BlogDraft } from "../types";

export type CreateDraftBody = Omit<
  BlogDraft,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateDraftBody = Partial<
  Pick<BlogDraft, "title" | "excerpt" | "contentMd" | "status">
>;

export const draftsApi = {
  list: () => api<BlogDraft[]>("/api/drafts"),
  get: (id: string) => api<BlogDraft>(`/api/drafts/${id}`),
  create: (body: CreateDraftBody) =>
    api<BlogDraft>("/api/drafts", { method: "POST", body }),
  update: (id: string, body: UpdateDraftBody) =>
    api<BlogDraft>(`/api/drafts/${id}`, { method: "PATCH", body }),
  remove: (id: string) =>
    api<void>(`/api/drafts/${id}`, { method: "DELETE" }),
};
