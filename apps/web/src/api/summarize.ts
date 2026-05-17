import { api } from "./client";
import type { CommitDetail, SummarizeResponse, SummarizeStyle } from "../types";

export type SummarizeBody = {
  repo: string;
  branch: string;
  commits: Array<
    Pick<CommitDetail, "sha" | "message" | "body" | "files" | "stats">
  >;
  style?: SummarizeStyle;
};

export const summarizeApi = {
  summarize: (body: SummarizeBody) =>
    api<SummarizeResponse>("/api/summarize", { method: "POST", body }),
};
