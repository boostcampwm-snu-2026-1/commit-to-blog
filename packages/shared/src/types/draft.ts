export type Draft = {
  contextKey: string;
  repoFullName: string;
  branch: string;
  commitShas: string[];
  title: string;
  /** Markdown */
  body: string;
  summary: string;
  /** UTC ISO 8601 */
  generatedAt: string;
  model: string;
};

export type CreateDraftRequest = {
  repoFullName: string;
  branch: string;
  commitShas: string[];
};

export type CreateDraftResponse = {
  draft: Draft;
};
