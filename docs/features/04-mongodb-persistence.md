# 04 MongoDB Persistence

## Goal

Connect the backend to MongoDB and create the persistence foundation for saved posts.

## Implementation Context

- MongoDB connection uses the database URI defined in [docs/architecture.md](../architecture.md#environment-variables).
- The `Post` model stores generated or edited blog content.
- Posts start as `draft` by default.
- Persistence should support later post CRUD and internal publishing flows.

## References

- Environment variables: [docs/architecture.md](../architecture.md#environment-variables)
- Data shape: [Post](../data-model.md#post)
- Backend layering: [Route Responsibilities](../backend-design.md#route-responsibilities), [Service Responsibilities](../backend-design.md#service-responsibilities)
- Task order: [docs/plan.md](../plan.md#4-mongodb-persistence)
- Verification: [Backend Checks](../testing.md#backend-checks), [Manual Completion Checklist](../testing.md#manual-completion-checklist)

## Acceptance Notes

- Saved posts persist after server restart.
- Database connection details do not leak to frontend code or logs.
- Missing database configuration fails clearly.
