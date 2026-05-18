---
name: github-api-integrator
description: Project-local skill for implementing or reviewing GitHub API integration in the AI-Blog Express server. Use when fetching repositories, branches, commits, commit details, changed files, diffs, handling GitHub tokens, choosing REST versus GraphQL, or connecting GitHub data to the blog generation flow.
---

# GitHub API Integrator

Use this skill for any GitHub data path that feeds the smart blog service.

## Why This Skill Exists

Without this skill, GitHub calls may leak token logic into the browser or return raw data that is hard for the UI and LLM to use. With this skill, the server owns GitHub access and returns normalized mission data.

## Inputs

1. Read `Mission.md` sections about GitHub and API requirements.
2. Read `checklist.md` sections 3 and 7.
3. Inspect `server/`, `.gitignore`, `.env.example`, and client API wrappers if present.
4. Read `project-structure-architect.md` when adding new files.

## Workflow

1. Keep all GitHub token usage inside the Express server.
2. Prefer REST API for repository, branch, commit, and commit-detail MVP flows unless an existing GraphQL pattern is already present.
3. Normalize responses into small client-facing shapes: `Repository`, `Branch`, `CommitSummary`, and `CommitDetail`.
4. Fetch only the data needed for the current step; avoid loading every diff before the user selects commits.
5. Add route-level error handling for missing token, bad repository, empty result, unauthorized, forbidden, and rate-limit responses.
6. Avoid logging full tokens, raw authorization headers, or private diff content unless the user explicitly requests local debugging output.
7. Document required environment variables in `.env.example` using empty placeholder values.

## Suggested Endpoints

- `GET /api/github/repositories`
- `GET /api/github/repositories/:owner/:repo/branches`
- `GET /api/github/repositories/:owner/:repo/commits?branch=...`
- `GET /api/github/repositories/:owner/:repo/commits/:sha`

## Quality Check

- Browser code never sees `GITHUB_TOKEN`.
- API responses are stable enough for the React UI and LLM prompt builder.
- Empty, loading, and error states can be represented by the client.
- The implementation advances Repository, Branch, Commit, or Commit detail checklist items.
