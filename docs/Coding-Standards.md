# Coding Standards

## General Philosophy
Write code for humans first, machines second. Code must be highly readable, modular, and strongly typed.

## Naming Conventions
- **Files & Directories:** `kebab-case` for directories and general files (e.g., `user-service.ts`, `components/`). `PascalCase` for React component files (e.g., `HabitCard.tsx`).
- **Variables & Functions:** `camelCase` (e.g., `calculateStreak`, `userProfile`).
- **Classes & Interfaces:** `PascalCase` (e.g., `UserRepository`, `HabitData`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`).

## Folder Conventions (Frontend)
Use a Feature-Sliced Design or feature-based modularity:
Avoid massive global `components/` folders. Keep components close to where they are used.
```
/features/auth/
  /components
  /hooks
  /api
  /types
```

## TypeScript Rules
- `strict: true` in `tsconfig.json` is mandatory.
- Avoid `any` at all costs. Use `unknown` if the type is truly dynamic, and type-narrow it.
- Use explicit return types for all exported functions and API route handlers.
- Prefer `interface` over `type` for object shapes to allow declaration merging and better error messages.

## Testing Standards
- **Unit Tests:** Jest or Vitest. Required for all complex business logic and utility functions (e.g., health plan generation logic). Target 80% coverage on core domains.
- **Component Tests:** React Testing Library. Test behavior, not implementation details (e.g., test that a button click shows a modal, not that state `x` becomes `true`).
- **E2E Tests:** Playwright or Cypress for critical user journeys (Sign up, Health Assessment, Logging a habit).

## Git Commit Strategy
Follow Conventional Commits:
- `feat: [description]` for new features.
- `fix: [description]` for bug fixes.
- `chore: [description]` for maintenance tasks, dependencies.
- `refactor: [description]` for code changes that neither fix a bug nor add a feature.
- `docs: [description]` for documentation updates.

## Code Review Checklist
- [ ] Does this PR solve the stated problem?
- [ ] Are TypeScript types strict and accurate?
- [ ] Are there unit/component tests for new logic?
- [ ] Are edge cases (e.g., network failure, null data) handled?
- [ ] Is the UI responsive and accessible?
- [ ] Are there any security implications (e.g., missing authorization checks)?
