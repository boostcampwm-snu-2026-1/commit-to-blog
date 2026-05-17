# 05 GitHub Repository Data Flow

## Goal

Fetch GitHub repositories, branches, and commits through the backend so the frontend can build a commit selection workflow without exposing GitHub credentials.

## Implementation Context

- Backend GitHub service reads the GitHub token defined in [docs/architecture.md](../architecture.md#environment-variables) from server configuration.
- Frontend calls Express API routes, never GitHub directly.
- Repository, branch, and commit responses are normalized before reaching the frontend.
- GitHub API failures return clear server-side errors.

## References

- System flow: [docs/architecture.md](../architecture.md#main-flow)
- API routes: [docs/api-design.md](../api-design.md#github-api-proxy)
- Data shapes: [Repository](../data-model.md#repository), [Branch](../data-model.md#branch), [Commit](../data-model.md#commit)
- Task order: [docs/plan.md](../plan.md#5-github-repository-data-flow)
- Verification: [Backend Checks](../testing.md#backend-checks)

## Acceptance Notes

- Repository, branch, and commit data returned to the frontend matches the shared data model.
- GitHub token is never exposed to the frontend.
- API errors are user-readable without exposing secrets.
