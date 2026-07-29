# M5 – User Onboarding & Health Assessment Walkthrough

## Overview

M5 implements a **7-step onboarding wizard** that collects a user's health baseline and persists it to the database. It integrates tightly with Better Auth sessions (M4) and the Prisma schema (M3).

---

## Architecture

Following Clean Architecture with Feature-based organisation:

```
src/features/onboarding/
  domain/
    types.ts              — Zod schemas + TypeScript types for each step
  application/
    actions.ts            — Server Action: validates + persists to DB
  presentation/
    OnboardingWizard.tsx  — Main wizard shell (client component, useReducer)
    ProgressBar.tsx       — Visual step progress indicator
    steps/
      WelcomeStep.tsx
      BasicInfoStep.tsx
      LifestyleStep.tsx
      GoalsStep.tsx
      HealthConditionsStep.tsx
      ReviewStep.tsx
      SuccessStep.tsx
```

---

## Wizard Steps

| Step | Name | Fields |
|------|------|--------|
| 0 | Welcome | Informational intro |
| 1 | Basic Information | Date of birth, gender, height (cm), weight (kg) |
| 2 | Lifestyle | Activity level, smoking, alcohol, diet type, sleep hours |
| 3 | Goals | Multi-select from 10 health goals (max 5) |
| 4 | Health Conditions | Multi-select conditions + optional notes |
| 5 | Review | Full summary with per-section Edit shortcuts |
| 6 | Success | Confirmation with CTA to dashboard |

---

## State Management

All form data lives in a single `useReducer` inside `OnboardingWizard.tsx`. Each step receives its slice of state and dispatches typed actions on completion. This means:
- Answers are **preserved** when navigating back
- No intermediate database roundtrips
- State is type-safe end-to-end

---

## Validation

- **Per-step**: Each step validates its own data using Zod before advancing
- **Server-side**: `submitAssessmentAction` re-validates the full payload server-side before any DB writes
- **Database-level**: `HealthProfile.userId` has `@unique` — double-submissions are rejected

---

## Database Changes

**`HealthProfile`** — New lifestyle fields added:
- `activityLevel` (String)
- `dietType` (String, optional)
- `smokingStatus` (String)
- `alcoholConsumption` (String)
- `sleepHoursPerNight` (Float, optional)

**`HealthAssessment`** — Revised for MVP:
- Removed `overallScore` (no score calculation per M5 requirements)
- Added `goals` (String — JSON-serialised array)
- Added `healthConditions` (String — JSON-serialised array)
- Added `additionalNotes` (String, optional)

---

## Route Guards

- `/onboarding` is a protected route — unauthenticated users are redirected to `/login` by Edge Middleware
- `onboarding/page.tsx` (Server Component) checks if the user already has a `HealthProfile`. If yes, redirects to `/dashboard` to prevent re-submission
- `dashboard/page.tsx` redirects to `/onboarding` if no `HealthProfile` exists — ensuring new users always complete onboarding first

---

## How to Test

1. Register a new account at `/register`
2. You will be redirected to `/dashboard` → immediately redirected to `/onboarding`
3. Complete all 7 steps; verify back-navigation preserves your answers
4. Submit on the Review step — check DB for new `HealthProfile` and `HealthAssessment` records
5. Success screen appears → click "Go to Dashboard"
6. Dashboard now loads without redirecting to onboarding
7. Visit `/onboarding` directly — you are redirected to `/dashboard`
