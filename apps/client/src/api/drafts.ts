import type {
  CreateDraftRequest,
  CreateDraftResponse,
} from "@commit-to-blog/shared";
import { apiFetch } from "./client.js";

export function createDraft(
  body: CreateDraftRequest,
): Promise<CreateDraftResponse> {
  return apiFetch<CreateDraftResponse>(`/api/posts/draft`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
