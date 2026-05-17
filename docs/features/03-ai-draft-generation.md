# 03 AI Draft Generation

## Goal

Generate a development blog draft from selected GitHub commits using OpenAI from the backend.

## Implementation Context

- Backend OpenAI service reads the OpenAI API key defined in [docs/architecture.md](../architecture.md#environment-variables) from server configuration.
- The request uses selected repository, branch, and commit summaries.
- The response maps to title, summary, and content.
- The generated draft is shown in the editor before it is saved as a post.

## References

- System flow: [docs/architecture.md](../architecture.md#main-flow)
- API route: [docs/api-design.md](../api-design.md#blog-draft-api)
- Data shapes: [Generated Draft](../data-model.md#generated-draft), [Commit](../data-model.md#commit)
- Backend service role: [docs/backend-design.md](../backend-design.md#service-responsibilities)
- Frontend editor flow: [docs/frontend-design.md](../frontend-design.md#editor)
- Task order: [AI Blog Draft Generation](../plan.md#6-ai-blog-draft-generation)
- Verification: [Backend Checks](../testing.md#backend-checks), [Frontend Checks](../testing.md#frontend-checks)

## Acceptance Notes

- OpenAI key is never exposed to the frontend.
- Generation failures return a user-readable error.
- The editor remains editable after draft generation.
