export interface CommitRef {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  defaultBranch: string;
  private: boolean;
}

export interface Branch {
  name: string;
  sha: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  summary: string;
  repo_name: string;
  branch: string;
  commits: CommitRef[];
  tags: string[];
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface BlogDraft {
  title: string;
  body: string;
  summary: string;
}
