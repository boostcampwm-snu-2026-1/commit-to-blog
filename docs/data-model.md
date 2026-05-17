# Data Model

## Repository

Repository data comes from the GitHub API and is normalized for the frontend selection UI.

```ts
type RepositorySummary = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};
```

## Branch

```ts
type BranchSummary = {
  name: string;
  commitSha: string;
};
```

## Commit

This is the basic commit data needed for blog draft generation. Changed files and diff summaries can be added later if draft quality needs improvement.

```ts
type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
};
```

## Generated Draft

This is the draft returned by OpenAI. Before saving, it can live as frontend editing state.

```ts
type GeneratedDraft = {
  title: string;
  summary: string;
  content: string;
};
```

## Post

This is the main MongoDB-backed model.

```ts
type PostStatus = "draft" | "published";

type Post = {
  id: string;
  title: string;
  summary: string;
  content: string;
  repository: {
    owner: string;
    name: string;
    fullName: string;
  };
  branch: string;
  commits: CommitSummary[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};
```

## Status Meaning

- `draft`: saved, but not shown in the published post view.
- `published`: visible in the service as a published blog post.

## Future Extensions

- Changed files and diff summaries per commit.
- Tags, categories, and thumbnails.
- User accounts and author data.
- OpenAI request and response history.
