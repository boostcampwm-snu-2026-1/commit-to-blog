---
name: commit-review
description: Use before committing changes to review git diffs, verify project guideline compliance, and write a conventional commit message.
---

# Commit Review

Use this skill before creating a git commit.

## Workflow

1. Inspect the working tree with `git status --short`.
2. Review the exact changes intended for the commit:
   - Use `git diff -- <path>` for unstaged changes.
   - Use `git diff --cached -- <path>` for staged changes.
   - Confirm that unrelated or user-owned changes are not included.
3. Check project guideline compliance:
   - Code, comments, documentation, and commit messages must be in English.
   - Do not add emojis to code, comments, documentation, config, tests, or commit messages.
4. Run relevant formatting, linting, or tests when they are available and appropriate for the touched files.
5. Format the commit message using a conventional commit prefix followed by a colon:
   - `feat: describe user-facing functionality`
   - `fix: describe the bug fix`
   - `chore: describe maintenance-only work`
   - `docs: describe documentation-only changes`
   - `test: describe test-only changes`
   - `refactor: describe behavior-preserving code changes`

## Commit Message Rules

- Use the form `<prefix>: <summary>`.
- Keep the summary concise, imperative, and English-only.
- Use a valid prefix such as `feat:`, `fix:`, `chore:`, `docs:`, `test:`, or `refactor:`.
- Ensure the colon is present immediately after the prefix.
- Do not include emojis.
