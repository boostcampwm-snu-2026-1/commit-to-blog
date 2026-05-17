# 05 Internal Publishing

## Goal

Publish posts inside this service by changing post status to `published` and displaying published posts in the frontend.

## Implementation Context

- Publishing is an internal state change, not an external blog upload.
- Published posts are fetched through the server-side status filter defined in [docs/api-design.md](../api-design.md#post-api).
- The frontend should not fetch all posts and filter published posts client-side.
- Changing a post to `published` records `publishedAt`.

## References

- Publishing scope: [docs/plan.md](../plan.md#mvp-scope)
- Post status model: [docs/data-model.md](../data-model.md#status-meaning)
- API contract: [docs/api-design.md](../api-design.md#post-api)
- Frontend screen: [docs/frontend-design.md](../frontend-design.md#published-post-view)
- Task order: [Saved and Published Post Views](../plan.md#9-saved-and-published-post-views)
- Verification: [Backend Checks](../testing.md#backend-checks), [Frontend Checks](../testing.md#frontend-checks)

## Acceptance Notes

- Draft posts do not appear in the published post view.
- Invalid post status filters return `400`.
- External blog platform publishing stays out of MVP scope.
