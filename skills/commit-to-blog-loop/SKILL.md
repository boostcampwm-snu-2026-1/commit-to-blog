---
name: commit-to-blog-loop
description: Use when working on the Commit to Blog project or similar AI product MVPs that turn GitHub activity into editable blog drafts. This skill helps convert broad requirements into a vertical slice, define API and data contracts, add demo fallbacks for external integrations, and verify the flow from generation to saved posts.
---

# Commit to Blog Loop

Use this skill when adding or refining features in this project.

## Workflow
1. Freeze the smallest user-visible slice before writing code.
2. Write down the API contract and storage shape first.
3. Add a demo fallback when a feature depends on GitHub or OpenAI.
4. Build the server path before polishing the UI.
5. Verify the full loop: select source data -> generate draft -> edit -> save/publish.

## Delivery Checklist
- The feature has a clear scope boundary.
- The required data objects are named and typed.
- External API failures have a safe fallback or clear error state.
- The UI exposes the happy path without hidden manual steps.
- Verification includes both technical checks and a user scenario.

## Project-specific Reminders
- GitHub requests belong on the Express server.
- Secrets must stay in `.env` and out of Git.
- Prefer durable storage over in-memory state for posts.
- Keep the generated blog editable by the user at all times.
