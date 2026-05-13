export type Branch = {
  name: string;
  isDefault: boolean;
  /** Head commit sha (40 chars) */
  headSha: string;
};

export type ListBranchesResponse = {
  branches: Branch[];
};
