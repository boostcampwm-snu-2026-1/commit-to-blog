---
name: mission-verifier
description: Project-local skill for recursively checking AI-Blog plans, implementation work, and project skills against Mission.md, checklist.md, security rules, and quality expectations. Use when preparing final reports, commits, pull requests, weekly plan updates, or after creating multiple skills to verify requirements coverage, remove weak instructions, and record validation gaps.
---

# Mission Verifier

Use this skill when the work needs a sober pass before calling it done.

## Why This Skill Exists

Without this skill, implementation or skill-writing work can look complete while missing mission evidence, token safety, or verification notes. With this skill, the agent checks coverage, removes weak artifacts, and reports remaining risk.

## Inputs

1. Read `Mission.md`.
2. Read `checklist.md`.
3. Read weekly plan documents if present.
4. Inspect changed files with `git diff --stat` and targeted file reads when a git repo exists.
5. For skill validation, read every relevant file under `skills/`.
6. For app validation, inspect `package.json` and run available tests or builds when feasible.

## Recursive Validation Loop

1. First pass: check structure, required frontmatter, stale mission references, duplicated scope, and missing security rules.
2. Fix or remove weak artifacts instead of preserving them for count.
3. Second pass: check whether the remaining work covers the current request and at least one checklist section.
4. If removal drops required skill count or feature coverage below the user's request, create or revise the smallest useful replacement.
5. Final pass: verify file names, trigger descriptions, mission alignment, and final-report evidence.

## Mission Checks

- Plans name the current week, MVP boundary, deferred work, and verification method.
- GitHub API and LLM API secrets stay server-side.
- `.env` values are not written to code, docs, logs, or reports.
- User flow covers repository, branch, commit selection, AI draft, editing, saving, and later review.
- Planning and verification are documented when the mission asks for them.
- Claims in the final answer match what was actually implemented or checked.

## Output

Lead with findings or confirmation. Name files checked, fixes made during validation, commands run, and any tests or manual scenarios that still remain.
