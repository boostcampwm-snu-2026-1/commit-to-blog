# 02 Frontend Styling Foundation

## Goal

Set up Tailwind CSS and the project token system before building product screens, so later UI work uses semantic styling utilities consistently.

## Implementation Context

- Add Tailwind CSS to the frontend build setup.
- Define primitive tokens for raw design values only.
- Define semantic tokens for application meaning.
- Expose semantic tokens through Tailwind utilities.
- Use semantic utilities in shared base styles and React components.

## References

- Styling rules: [docs/frontend-design.md](../frontend-design.md#styling-and-token-strategy)
- Task order: [docs/plan.md](../plan.md#2-frontend-styling-foundation)
- Verification: [docs/testing.md](../testing.md#frontend-checks)

## Acceptance Notes

- Components avoid raw primitive color utilities such as `bg-slate-50` when a semantic utility exists.
- Primitive values stay in token/theme definition files unless a direct primitive use is intentionally justified.
