# Frontend Guide

## Responsibilities

The Next.js frontend implements the MVP product experience and calls only the backend API.

- Feed: saved post cards with status, metadata, and publish/edit actions
- Stories: repository shortcuts
- Studio: repository, branch, commit selection
- Composer: AI draft preview and editor

## Runtime

```bash
cd frontend
npm install
npm run build
npm run dev
npx playwright test --project=chrome
```

## Package Layout

```text
frontend/
  src/app/          Next.js routes and global styles
  src/features/     feature-specific UI and hooks
  src/shared/       shared API client and reusable components
  e2e/              Playwright Chrome flow tests
```

## Product Design Rules

- First screen is the usable feed/studio experience, not a landing page.
- Keep controls dense and predictable for repeated workflow use.
- Use backend data and mock data to show real product states instead of decorative placeholders.
- Keep external API details out of React components.
- Any UI copy or selector change that affects Playwright must update `frontend/e2e/app.spec.ts`.

## Validation

```bash
cd frontend
npm run build
npx playwright test --project=chrome
```
## Validation

```bash
cd frontend
npm run lint
npm run format:check
npm run typecheck
npm run build
npm run gui:check
```

CI runs lint, formatting, typecheck, high-severity audit, build, and Chrome E2E before merge.
