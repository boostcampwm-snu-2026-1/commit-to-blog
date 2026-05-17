export type Repository = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  htmlUrl: string;
  visibility: "public" | "private";
};

export type Branch = {
  name: string;
  sha: string;
  protected: boolean;
};

export type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
};
