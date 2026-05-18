# 08 Draft Editing and Saving

## Goal

Let users edit generated drafts and save them as draft posts.

## Implementation Context

- Generated drafts appear in editable title, summary, and content fields.
- Saving creates a `draft` post by default.
- Existing saved posts can be updated.
- Duplicate save or generate requests are blocked while a request is in progress.

## References

- Frontend editor: [docs/frontend-design.md](../frontend-design.md#editor)
- Post API: [docs/api-design.md](../api-design.md#post-api)
- Data shapes: [Generated Draft](../data-model.md#generated-draft), [Post](../data-model.md#post)
- Task order: [docs/plan.md](../plan.md#8-draft-editing-and-saving)
- Verification: [Backend Checks](../testing.md#backend-checks), [Frontend Checks](../testing.md#frontend-checks)

## Acceptance Notes

- Edited content, not just the generated draft, is what gets saved.
- Save failures show user-readable errors.
- Draft posts remain editable after saving.
