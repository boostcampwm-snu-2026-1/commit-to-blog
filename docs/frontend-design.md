# Frontend Design

## Technical Baseline

- Vite + React + TypeScript.
- Tailwind CSS for styling.
- API calls use only the Express server `/api` endpoints.
- Secrets are not stored in frontend code.

## Styling and Token Strategy

The frontend uses a two-layer CSS token system:

- Primitive tokens define raw design values, such as color scales, spacing steps, radius values, shadows, and typography sizes.
- Semantic tokens map those raw values to product meaning, such as `background`, `surface`, `text-primary`, `text-muted`, `border-default`, `action-primary`, `action-danger`, `status-success`, and `status-warning`.

Application components should use semantic tokens whenever possible. Primitive tokens should be used mainly inside the token definition layer, Tailwind theme mapping, or rare low-level styling primitives.

Suggested token layers:

```text
primitive tokens
  -> semantic tokens
    -> Tailwind utilities
      -> React components
```

Example usage direction:

- Prefer `bg-surface`, `text-primary`, `text-muted`, `border-default`, and `bg-action-primary`.
- Avoid direct component usage such as `bg-slate-50`, `text-zinc-700`, or `border-gray-200` unless there is a specific reason.
- Keep status styles semantic, such as `text-status-success` or `bg-status-warning-subtle`.
- Add new primitive values only when semantic tokens cannot be composed from existing values.

## Screens

### Saved Post List

- Shows saved posts as cards.
- Each card shows title, summary, repository, branch tag, status, and date.
- The user can open details, edit, delete, or change publish status.

### Post Creation

- Fetch and select a GitHub repository.
- Fetch branches for the selected repository.
- Show commits for the selected branch and allow multiple commit selection.
- Request AI draft generation from the selected commits.
- Show generated title, summary, and content in the editor.

### Editor

- Edit title, summary, and content.
- Save creates or updates a MongoDB-backed post.
- Publish changes the post status to `published`.

### Published Post View

- Shows `published` posts as readable blog posts inside this service.
- Fetches published posts through the server-side status filter defined in [docs/api-design.md](api-design.md).
- External blog platform publishing is not part of the MVP.

## State Flow

```text
select repository
  -> select branch
  -> select commits
  -> generate AI draft
  -> edit draft
  -> save as draft
  -> change to published
  -> display published post
```

## Components

- `RepositorySelector`: repository fetching and selection.
- `BranchSelector`: branch fetching and selection.
- `CommitList`: commit list and multi-select behavior.
- `DraftEditor`: title, summary, and content editing.
- `PostCard`: saved post card.
- `PostList`: saved post list.
- `PostDetail`: saved or published post detail.

## Interaction Rules

- Branch and commit controls are disabled until a repository is selected.
- Commit selection and generated drafts are cleared when the branch changes.
- Duplicate requests are blocked while AI draft generation is in progress.
- Save, publish, and delete failures show user-readable error messages.
- Delete uses a confirmation step.
