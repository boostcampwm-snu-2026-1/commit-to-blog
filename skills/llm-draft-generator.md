---
name: llm-draft-generator
description: Project-local skill for designing, implementing, or reviewing LLM-powered blog draft generation for AI-Blog. Use when preparing selected commit data, limiting diffs, writing prompts, calling an LLM from Express, parsing title/summary/content output, or improving draft quality and failure handling.
---

# LLM Draft Generator

Use this skill when GitHub commit data becomes an editable development blog draft.

## Why This Skill Exists

Without this skill, the LLM may receive noisy diffs and produce a commit list instead of a blog post. With this skill, the agent prepares bounded evidence, asks for a useful draft shape, and keeps the output editable and grounded.

## Inputs

1. Read `Mission.md` sections about AI summary, editing, and API requirements.
2. Read `checklist.md` sections 4 and 7.
3. Inspect `server/services/`, `server/routes/`, prompt files, and blog post types if present.
4. Read `github-api-integrator.md` when the draft input depends on GitHub response shape.

## Workflow

1. Accept only selected commits as draft input.
2. Convert commit data into a compact evidence bundle: repository, branch, commit messages, changed files, important patches or summaries.
3. Limit or summarize long diffs before calling the LLM.
4. Keep the LLM API key in the Express server environment only.
5. Ask the LLM for structured output with `title`, `summary`, and `content`.
6. Require the draft to explain background, problem, implementation, key changes, result, and next improvements.
7. Treat LLM output as a draft, not truth; avoid claims that are not supported by commit evidence.
8. Return a shape the editor can immediately load.

## Prompt Checks

- The prompt says the audience is a development blog reader.
- The prompt forbids simple commit-message listing.
- The prompt asks for Korean output unless the user requests otherwise.
- The prompt instructs the model to mention uncertainty instead of inventing facts.

## Quality Check

- Client code never sees the LLM API key.
- Long diffs have a truncation or summarization strategy.
- Empty, failed, or malformed responses are handled.
- The result can be edited and saved as a `BlogPost`.
