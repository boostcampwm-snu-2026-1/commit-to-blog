# AGENTS.md

## Project Overview

This project is a web application that analyzes GitHub activity, generates a development blog draft, lets the user edit it, and stores or publishes the post inside this service.

## Working Rules

- Read `docs/*.md` and `docs/features/*.md` before starting implementation.
- If any feature, scope, or execution detail is ambiguous, ask the user before implementing.
- Ask the user before any action that requires their setup or approval. Examples: project scaffolding, package installation, API key creation, MongoDB setup, or external service configuration.
- Do not revert user changes. If a file has existing changes, read it first and build on top of it.
- If the implementation and documentation disagree, ask whether the documentation should be updated first.

## Directory Boundaries

- `frontend/`: Vite + React + TypeScript frontend code.
- `backend/`: Express + TypeScript backend code.
- `docs/`: planning, architecture, API, data model, frontend, backend, feature, and testing documents.

## Technical Decisions

- The frontend uses Vite, React, and TypeScript.
- The frontend uses Tailwind CSS for styling.
- The backend uses Express and TypeScript.
- The backend uses `cors` and `dotenv`.
- Drafts and saved posts are designed to be stored in MongoDB.
- GitHub API and OpenAI API calls are made from the Express server, not from the browser.
- GitHub token, OpenAI API key, and MongoDB URI are managed through `.env` and must not be committed.
- Publishing means changing a post to `published` status and showing it in this service. It does not mean uploading to an external blog platform.
- CSS tokens are split into primitive tokens and semantic tokens. App components should use semantic tokens whenever possible.

## Command Approval Rules

Ask the user before running these actions:

- Project creation commands such as `npm create vite@latest`.
- Dependency installation commands such as `npm install`, `npm create`, or `npx`.
- MongoDB instance creation, Atlas setup, or local database setup choices.
- Any action requiring API key or token creation.
- Any initialization or installation step that requires external network access.

## Security Rules

- Do not commit `.env`, API keys, tokens, or raw MongoDB URIs.
- Do not put `GITHUB_TOKEN`, `OPENAI_API_KEY`, or similar secrets in frontend code.
- The backend should fail with a clear error when required configuration is missing.
- Do not log tokens, API keys, or authorization headers.

## AI Workflow and Skill Notes

- Keep AI-assisted planning, implementation, and verification steps small enough to document in PR notes or project docs.
- If a repeated workflow looks useful as a custom Skill, suggest it to the user before creating it.
- Possible Skill candidates: GitHub commit analysis prompt review, blog draft quality review, API design checklist.

## Pre-Implementation Check

Before implementation, make sure these documents match the current direction:

- `docs/plan.md`
- `docs/architecture.md`
- `docs/data-model.md`
- `docs/api-design.md`
- `docs/frontend-design.md`
- `docs/backend-design.md`
- `docs/testing.md`
- `docs/features/*.md`

`docs/plan.md` checklists should contain implementation or verification tasks with clear completion criteria. Process rules, approval rules, and conditional reminders belong in `AGENTS.md`, not in the project task checklist.
Feature documents provide implementation context and flow. API contracts, shared data shapes, environment variables, and cross-cutting rules should stay in the top-level source-of-truth documents.
