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
  /** 자유 태그 (소문자 추천) */
  tags: string[];
  /** GitHub Issue 등 외부에 발행된 URL */
  publishedExternalUrl: string | null;
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
  tags?: string[];
};

export type UpdatePostRequest = Partial<
  Pick<Post, "title" | "body" | "summary" | "tags">
>;

export type PublishExternalRequest = {
  /** GitHub Issue body 추가 텍스트 (선택) */
  note?: string;
};

export type PublishExternalResponse = {
  post: Post;
  url: string;
};

export type PublishPostRequest = {
  publish: boolean;
};
