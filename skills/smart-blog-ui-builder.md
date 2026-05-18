---
name: smart-blog-ui-builder
description: Project-local skill for building or reviewing the AI-Blog React user interface. Use when implementing repository, branch, and commit selection; AI draft generation controls; editable blog title, summary, and body fields; saved-post cards; loading, empty, error, save, and publish states.
---

# Smart Blog UI Builder

Use this skill for React work that turns the GitHub and LLM backend into a usable blog authoring flow.

## Why This Skill Exists

Without this skill, the UI can become a set of disconnected forms. With this skill, the agent preserves the mission flow from repository selection to editable draft and saved post management.

## Inputs

1. Read `Mission.md` UI and saved-post requirements.
2. Read `checklist.md` sections 5 and 6.
3. Inspect existing `src/` components, pages, styles, and client API helpers.
4. Read `project-structure-architect.md` when adding or moving UI files.

## Workflow

1. Make the first screen the actual blog creation workspace, not a marketing page.
2. Build the flow in order: repository, branch, commits, generate, edit, save.
3. Disable dependent controls until their required selection exists.
4. Show loading, empty, and error states close to the control that caused them.
5. Keep selected repository, branch, selected commits, generated draft, and edited post state explicit.
6. Let the user edit title, summary, and body before saving.
7. Show saved posts as cards with title, branch tag, summary preview, date, and status when available.
8. Support reopening a saved post for editing before publish or final review.

## UI Checks

- The user can see what data will be sent to AI before generating.
- The generate action is blocked when no commit is selected.
- The save action is blocked when required post fields are missing.
- Text fits in cards and controls at mobile and desktop sizes.
- Buttons and controls communicate state without relying on hidden console output.

## Output

Report changed UI files, user flows completed, and any states still mocked or pending backend integration.
