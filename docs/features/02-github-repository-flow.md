# 02 GitHub Repository Flow

## Goal

Let the user select a GitHub repository, branch, and commits through the frontend while keeping GitHub API access on the backend.

## Implementation Context

- Backend GitHub service reads the GitHub token defined in [docs/architecture.md](../architecture.md#environment-variables) from server configuration.
- Frontend calls Express API routes, never GitHub directly.
- Selection order is repository, branch, then commits.
- Changing repository clears branch, commit, and generated draft state.
- Changing branch clears commit and generated draft state.

## References

- System flow: [docs/architecture.md](../architecture.md#main-flow)
- API routes: [docs/api-design.md](../api-design.md#github-api-proxy)
- Data shapes: [Repository](../data-model.md#repository), [Branch](../data-model.md#branch), [Commit](../data-model.md#commit)
- Frontend flow: [docs/frontend-design.md](../frontend-design.md#state-flow)
- Task order: [GitHub Repository Data Flow](../plan.md#5-github-repository-data-flow), [Frontend Selection Workflow](../plan.md#7-frontend-selection-workflow)
- Verification: [Backend Checks](../testing.md#backend-checks), [Frontend Checks](../testing.md#frontend-checks)

## Acceptance Notes

- Repository, branch, and commit data returned to the frontend matches the shared data model.
- Loading and error states exist for each lookup step.
- GitHub token is never exposed to the frontend.
