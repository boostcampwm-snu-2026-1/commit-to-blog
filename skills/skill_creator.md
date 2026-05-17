---
name: skill-creator
description: Project-local skill for designing, critiquing, creating, or updating Markdown skill files inside SNU_study/AI-Blog/skills. Use when the user asks to add, revise, organize, review, improve, rename, split, or consolidate AI skills for the AI-Blog smart blog mission, including GitHub/LLM workflow rules, Express/React project instructions, weekly planning habits, verification checks, and reusable agent process.
---

# Skill Creator

Use this file when creating or updating project-local skills under `skills/` for the AI-Blog smart blog mission.

## Principles

- Treat each skill as a compact operating procedure for a future AI, not as user-facing documentation.
- Optimize for reliable triggering, low context cost, and mission-specific behavior.
- Encode durable process discovered while planning, building, and verifying the GitHub-to-LLM blog service.
- Keep temporary notes, one-off implementation details, and raw PDF excerpts out of skills.
- Prefer one clear skill over several overlapping skills.
- Ask only when the missing answer would change the skill's scope, trigger, or source of truth.

## Mission Anchors

- The service reads GitHub activity, lets the user choose repositories, branches, commits, and code changes, then uses an LLM to draft editable development blog posts.
- Express should own GitHub API and LLM API calls; React should own repository selection, commit selection, editor, saved-post cards, and publishing UI.
- API tokens and `.env` values must never be copied into skills, examples, commits, or final reports.
- Weekly planning, scope control, checklist evidence, and verification notes are part of the mission, not optional polish.

## Inputs To Read

1. Read `skills/index.md` if it exists; otherwise list files under `skills/`.
2. Read any related skill before editing it.
3. Read `checklist.md` when the skill touches scope, planning, progress, validation, or commits.
4. Read weekly plan documents if they exist, such as `week*.md`, `plan*.md`, or `docs/*.md`.
5. Read the week-11 mission PDF or extracted notes only when source requirements matter.
6. Check `package.json`, `src/`, `server/`, or `README.md` when the skill gives implementation guidance.

## Scope Test

Before creating or revising a skill, ask:

- Does the `description` say both what the skill does and when to use it?
- Would an AI know whether to read this file from the description alone?
- Does the skill duplicate another skill in `skills/`?
- Does the body contain only instructions that change future behavior?
- Are source files named explicitly instead of copied into the skill?
- Does the workflow reflect this mission's constraints: GitHub data, LLM output, editable posts, saved posts, weekly scope, and token safety?
- Could a future AI validate that it followed the skill?

Create or keep a skill only when the "with skill" path is meaningfully better than general reasoning. Meaningful improvement includes preventing likely mistakes, saving repeated project discovery, making work more consistent, improving validation, or encoding non-obvious mission knowledge.

## File Contract

- Store project skills as Markdown files in `skills/`.
- Use the filename requested by the user. If no filename is given, prefer lowercase hyphen-case such as `github-blog-planner.md`.
- Include YAML frontmatter with exactly `name` and `description`.
- Use a lowercase hyphen-case `name`, even when the filename uses another convention.
- Put trigger guidance in `description`; it is the part an AI sees before loading the body.
- Keep the body under roughly 120 lines unless the skill truly needs more structure.
- Do not create extra README, changelog, installation, or meta-explanation files for local skills.
- Update `skills/index.md` when it exists or when several skills need navigation; do not create an index only for a tiny one-file edit unless asked.

## Body Shape

Use this structure unless another shape is clearly better:

1. Purpose: one short paragraph naming the job.
2. Inputs: files, requirements, or code paths to read first.
3. Workflow: ordered steps the AI should follow.
4. Mission checks: GitHub API, LLM behavior, editable post flow, saved-post flow, secret handling, and weekly scope.
5. Quality check: short pass/fail checks before finishing.
6. Output: what the AI should report back to the user.

Skip sections that would be empty or obvious.

## Creation Workflow

1. Name the skill and define when it should trigger.
2. Search `skills/` for overlap before creating a new file.
3. Compare "without skill" versus "with skill"; keep the skill only if the difference is meaningful.
4. Identify source documents the skill should read, such as `checklist.md`, weekly plans, the mission PDF, or another file under `skills/`.
5. Write the frontmatter first.
6. Add the shortest body that makes the workflow repeatable.
7. Update `skills/index.md` if it exists or the change introduces enough skills to need navigation.
8. Read the new file back to catch formatting and frontmatter issues.
9. Summarize changed files, the impact comparison, and how future AI should use the skill.

## Update Workflow

- Preserve the existing skill's purpose unless the user asks to change it.
- State the main weakness before editing when the user asks for critique or review.
- Tighten broad trigger descriptions when a skill fires too often.
- Add concrete workflow steps when a skill is too vague to use.
- Remove stale instructions copied from other missions or repositories.
- Add AI-Blog constraints only when they affect future behavior, such as server-side GitHub requests, `.env` secrets, LLM draft quality, post editing, or saved-post validation.
- Split a skill when it contains two unrelated workflows with different triggers.
- Consolidate skills when two files would always be read together for the same task.
- Update `skills/index.md` if it exists and a skill is added, renamed, or removed.

## Conflict Rules

- If a project-local skill conflicts with `checklist.md` or the mission PDF, treat the mission source as the project source of truth and update the skill.
- If implementation code conflicts with an older skill, inspect the code and either update the skill or note the mismatch before editing.
- If two local skills conflict, prefer the narrower skill for the task and note the conflict in the final response.
- If a user request conflicts with a skill, follow the user request for that turn and update the skill only when asked.

## Final Check

- The frontmatter has exactly `name` and `description`.
- The description says both what the skill does and when to use it.
- The body contains no stale references to unrelated missions.
- New skills include a clear reason why "with skill" is better than "without skill".
- The instructions are actionable without the original conversation.
- API tokens, keys, and `.env` values are absent.
- `skills/index.md` is updated when applicable.
- The final response names the files changed and the reason for the revision.
