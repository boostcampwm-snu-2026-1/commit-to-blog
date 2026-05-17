export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
}

export interface GithubBranch {
  name: string;
  commit: { sha: string };
}

export interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

export interface Post {
  id: number;
  title: string;
  content: string;
  summary: string;
  branch: string;
  commit_sha: string;
  repo_name: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface GenerateRequest {
  repoFullName: string;
  commitSha: string;
  commitMessage: string;
  diff: string;
}

export interface GenerateResponse {
  title: string;
  content: string;
  summary: string;
}
