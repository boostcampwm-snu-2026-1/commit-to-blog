# 04 Post Management

## Goal

Persist generated and edited posts in MongoDB and support saved post management inside the service.

## Implementation Context

- MongoDB connection uses the database URI defined in [docs/architecture.md](../architecture.md#environment-variables).
- Saved posts use the `Post` model and start as `draft` by default.
- The backend supports post create, list, detail, update, status update, and delete operations.
- The frontend shows saved posts as cards and allows detail, edit, delete, and status change flows.

## References

- Environment variables: [docs/architecture.md](../architecture.md#environment-variables)
- Post API: [docs/api-design.md](../api-design.md#post-api)
- Data shape: [Post](../data-model.md#post)
- Backend layering: [Route Responsibilities](../backend-design.md#route-responsibilities), [Service Responsibilities](../backend-design.md#service-responsibilities)
- Frontend screens: [Saved Post List](../frontend-design.md#saved-post-list), [Editor](../frontend-design.md#editor)
- Task order: [MongoDB Persistence](../plan.md#4-mongodb-persistence), [Draft Editing and Saving](../plan.md#8-draft-editing-and-saving), [Saved and Published Post Views](../plan.md#9-saved-and-published-post-views)
- Verification: [Backend Checks](../testing.md#backend-checks), [Manual Completion Checklist](../testing.md#manual-completion-checklist)

## Acceptance Notes

- Saved posts persist after server restart.
- Delete requires confirmation in the frontend.
- Status changes use the backend status endpoint rather than local-only state.
