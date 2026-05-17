# 06 AI Blog Draft Generation

## Goal

Generate a development blog draft from selected GitHub commits using Gemini from the backend.

## Implementation Context

- Backend Gemini service reads the Gemini API key defined in [docs/architecture.md](../architecture.md#environment-variables) from server configuration.
- The request uses selected repository, branch, and commit summaries.
- The response maps to title, summary, and content.
- The generated draft is shown in the editor before it is saved as a post.

## References

- System flow: [docs/architecture.md](../architecture.md#main-flow)
- API route: [docs/api-design.md](../api-design.md#blog-draft-api)
- Data shapes: [Generated Draft](../data-model.md#generated-draft), [Commit](../data-model.md#commit)
- Backend service role: [docs/backend-design.md](../backend-design.md#service-responsibilities)
- Task order: [docs/plan.md](../plan.md#6-ai-blog-draft-generation)
- Verification: [Backend Checks](../testing.md#backend-checks), [Frontend Checks](../testing.md#frontend-checks)

## Acceptance Notes

- Gemini key is never exposed to the frontend.
- Generation failures return a user-readable error.
- The editor remains editable after draft generation.
