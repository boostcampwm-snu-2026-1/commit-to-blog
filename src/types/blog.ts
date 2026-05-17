export type BlogDraft = {
  title: string;
  summary: string;
  content: string;
  sourceCommitShas: string[];
};

export type EditablePost = {
  title: string;
  summary: string;
  content: string;
};
