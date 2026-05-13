export type PostStatus = "draft" | "published";

export type PostSource = {
  repoFullName: string;
  branch: string;
  commitShas: string[];
};

export type Post = {
  /** uuid v4 */
  id: string;
  title: string;
  /** Markdown */
  body: string;
  summary: string;
  source: PostSource;
  status: PostStatus;
  /** UTC ISO 8601 */
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ListPostsResponse = {
  posts: Post[];
};

export type CreatePostRequest = {
  title: string;
  body: string;
  summary: string;
  source: PostSource;
};

export type UpdatePostRequest = Partial<
  Pick<Post, "title" | "body" | "summary">
>;

export type PublishPostRequest = {
  publish: boolean;
};
