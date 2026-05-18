---
name: project-structure-architect
description: Project-local skill for designing or revising the AI-Blog file and directory structure. Use when creating the React/Express project layout, deciding where routes, services, components, types, storage, prompts, tests, and environment files belong, or reviewing whether files are placed consistently.
---

# Project Structure Architect

Use this skill whenever the repository shape itself is part of the work.

## Why This Skill Exists

Without this skill, files may be added wherever the current task happens to need them. With this skill, the project keeps a predictable React/Express boundary that supports GitHub API, LLM draft generation, editing, and saved posts.

## Inputs

1. Read `Mission.md` and `checklist.md`.
2. Inspect the current tree with `rg --files` before proposing or editing structure.
3. Read `package.json` and existing config files if present.
4. Read related skills when the structure touches GitHub, LLM, UI, or verification work.

## Recommended Shape

Adapt to the existing app before creating new folders.

```txt
src/
  components/
  pages/
  services/
  types/
server/
  index.ts
  routes/
  services/
  config/
  types/
docs/
  week-1-plan.md
  week-2-plan.md
skills/
```

## Workflow

1. Preserve existing conventions when a project already exists.
2. Keep client files under `src/`; keep GitHub and LLM secrets under `server/`.
3. Put reusable UI in `src/components/`, page-level flows in `src/pages/`, and client fetch wrappers in `src/services/`.
4. Put Express route handlers in `server/routes/`, external API logic in `server/services/`, environment parsing in `server/config/`, and shared server types in `server/types/`.
5. Keep mission planning docs in root or `docs/`; do not bury them in source folders.
6. Add `.env.example` placeholders when environment variables are introduced, but never write real token values.
7. Update imports and references after moving or adding files.

## Quality Check

- A future agent can guess where a new GitHub route, LLM prompt, UI component, or post type belongs.
- No server secret or token-dependent logic is placed in the React client.
- Directory names are few, boring, and directly tied to the mission.
- The final answer includes the structure change and why it helps the mission.
