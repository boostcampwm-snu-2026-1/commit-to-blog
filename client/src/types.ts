export interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
}

export interface Branch {
  name: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  repoName: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
}
