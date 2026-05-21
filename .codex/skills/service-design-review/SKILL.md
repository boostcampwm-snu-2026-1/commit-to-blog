---
name: service-design-review
description: Use this skill before implementing service features to analyze requirements, map frontend/backend/API boundaries, define risks, and choose verification gates.
---

# Service Design Review

Use this skill before coding a new feature or changing service architecture.

## Workflow

1. Restate the user goal in one sentence.
2. Identify affected layers: frontend, backend, database, external API, CI/CD, docs.
3. List existing modules to inspect before editing.
4. Define the smallest issue-sized unit of work.
5. Write acceptance criteria before implementation.
6. Choose verification commands that prove the change.
7. Record risks, tradeoffs, and follow-up work in the PR or docs.

## Required Output

- Scope: what changes and what does not change.
- Architecture impact: FE/BE/API/DB boundaries.
- Verification: exact commands or checks.
- PR notes: completed work, blocked moments, learned points.
