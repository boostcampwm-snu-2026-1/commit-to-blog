---
name: github-blog-workflow
description: Use when implementing or reviewing a GitHub-activity-to-development-blog service with mock-first API integration, backend-owned external API calls, week-based planning artifacts, and prompt-to-artifact verification.
---

# GitHub Blog Workflow

## Workflow

1. Convert the assignment into numbered features and write/update `docs/feature-log.md`.
2. Keep planning artifacts in `docs/weekly-plans/` before expanding implementation.
3. Build external API features mock-first. The backend owns GitHub and LLM calls; the frontend never calls external APIs directly.
4. If an external API is involved, verify current syntax against official docs and record the source in `docs/api-integration-research.md`.
5. Keep secrets in `.env`; commit only `.env.example` with dummy values.
6. Model each feature through data shape, API endpoint, UI state, and validation command.
7. Verify with backend tests, Swagger, frontend build, and browser UI inspection.

## Review Checklist

- Repository, branch, and commit selection are represented in both API and UI.
- LLM draft generation accepts selected commits and can run without real keys in mock mode.
- Saved posts include branch tag, summary preview, date, edit action, and publish action.
- Docker Compose controls frontend, backend, and PostgreSQL.
- The final audit maps every prompt requirement to concrete files or command output.
