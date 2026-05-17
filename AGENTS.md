# Agent Instructions & Project Conventions

This document defines the strict constraints and coding standards that all AI agents must follow when modifying or creating files in this repository.

## 1. Language & Documentation Constraints
- **Strict English Only:** All source code, inline comments, commit messages, console logs, error messages, and markdown documentation (`.md`) must be written entirely in English.
- **No Emojis in Code:** Do not use emojis in source code files, string literals, or comments unless explicitly requested by the user.

## 2. Development Workflow
- **Atomic Commits/Changes:** Implement only one micro-feature or fix one bug at a time. Do not chain multiple unrelated tasks into a single modification step.
- **Verification First:** Always run verification or build commands (e.g., `npm run build`, `npm run dev`) after modifying code to ensure that no typescript/javascript compilation errors or syntax breakages occur.
- **Graceful Error Handling:** When building API endpoints or frontend logic, ensure all edge cases and potential runtime errors are handled gracefully with clear, technical error messages.

## 3. Architecture Guidelines
- **Frontend (Vite + React):** Maintain a modular component structure. Separate UI presentation from business logic hooks where applicable. Use standard CSS.
- **Backend (Express):** Keep routing, controller logic, and service layers decoupled.