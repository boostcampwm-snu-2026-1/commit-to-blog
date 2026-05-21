import { useMutation } from "@tanstack/react-query";
import type {
  CreateDraftRequest,
  CreateDraftResponse,
} from "@commit-to-blog/shared";
import { createDraft } from "../../api/drafts.js";

export function useGenerateDraft() {
  return useMutation<CreateDraftResponse, Error, CreateDraftRequest>({
    mutationFn: (body) => createDraft(body),
  });
}
