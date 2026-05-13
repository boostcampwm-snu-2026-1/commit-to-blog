# Product Roadmap

Commitgram turns engineering activity into publishable development posts. The commercial direction is a team-facing content operations product for developer relations, engineering blogs, and internal release storytelling.

## Product Principles

- Keep GitHub and LLM credentials server-side.
- Make the default experience useful without external keys through deterministic mock mode.
- Treat every generated post as an editable draft, not an auto-published artifact.
- Preserve traceability from generated copy back to repositories, branches, commits, and changed files.
- Optimize the UI for recurring content operations by engineering teams.

## Current Release

- Repository, branch, and commit selection.
- Commit detail summaries with file-level change metrics.
- Claude Messages API-compatible draft generation.
- Feed, studio, composer, edit, save, and publish flows.
- Post analytics summary and engagement actions.
- Docker Compose controlled local environment.

## Near-Term Roadmap

1. Authentication and workspace model
   - Team accounts
   - Repository access boundaries
   - Role-based publish permissions

2. Content quality controls
   - Draft tone presets
   - Required review checklist before publish
   - Source commit citations inside generated posts

3. Publishing integrations
   - Markdown export
   - GitHub Pages repository publishing
   - Webhook-based CMS publishing

4. Reliability and operations
   - migration review workflow
   - structured JSON logging
   - background generation queue
   - API rate-limit handling and retry policy

5. Metrics
   - Post conversion from draft to published
   - Repository activity coverage
   - Generation latency and error rate

## Deferred

- Multi-tenant billing
- Rich text editor with collaborative editing
- Scheduled social cross-posting
