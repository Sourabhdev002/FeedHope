# M9 – Progress & Insights Walkthrough

## Overview

M9 adds a **Progress & Insights** feature to FeedHope. It reads the `DailyCheckIn` records already persisted by M8, runs them through a pure computation engine, and surfaces the results in a polished dashboard at `/dashboard/progress`. The existing dashboard (`/dashboard`) now shows real habit-completion data instead of hardcoded placeholders, and a persistent bottom navigation bar connects the two views.

---

## Architecture

```
src/features/progress/
  domain/
    progress-engine.ts        — Pure function: CheckIns + PlanTargets → WeeklyProgressSummary
  application/
    get-weekly-progress.ts    — Server-side Prisma query + engine call
  presentation/
    ProgressDashboard.tsx     — Page-level layout shell
    WeeklySummaryCards.tsx    — 2×2 metric cards with SVG radial rings
    HabitCompletionBar.tsx    — Habit % progress bar with micro-copy
    PersonalBestsSection.tsx  — 4-pill personal-best grid
    TrendIndicator.tsx        — Reusable trend badge (improving/stable/declining)

src/app/(protected)/dashboard/progress/
  page.tsx                    — Next.js Server Component route (/dashboard/progress)

src/components/
  BottomNav.tsx               — Sticky "Today | Progress" navigation bar
```

### Clean Architecture

- **Domain layer** (`progress-engine.ts`): fully pure — no Next.js, no Prisma, no async. Accepts plain objects, returns a typed DTO. Easily unit-testable.
- **Application layer** (`get-weekly-progress.ts`): the only file that touches the database. Fetches the last 14 `DailyCheckIn` rows and delegates all logic to the engine.
- **Presentation layer**: Server Components pass the `WeeklyProgressSummary` DTO down to Client Components; no raw Prisma types leak into the UI.

---

## What the Engine Computes

| Output | Algorithm |
|---|---|
| **`habitCompletionPct`** | (days where ALL habits ticked ÷ days logged) × 100 |
| **`weeklyWaterPct`** | total water ÷ (daily target × 7) × 100, capped at 100 |
| **`weeklyStepsPct`** | total steps ÷ (daily step target × 7) × 100, capped at 100 |
| **`avgSleepHours`** | mean sleep across days with a non-zero log |
| **`totalExerciseMins`** | sum of exercise minutes in the current week (Mon – today) |
| **`personalBests`** | max per metric across the last 14 days |
| **`trends`** | prev-7-day avg vs this-7-day avg; ≥10% = improving / declining, otherwise stable |
| **`activeDays`** | count of check-in records in the current Mon–Sun week |

---

## Trend Algorithm

The 14-day window is split into two halves:

- **W−2** (days 8–14 ago) — the comparison baseline
- **W−1** (days 1–7, i.e., current week) — the observed window

For each metric, the engine calculates a simple percentage change:

```
pctChange = (currentAvg − priorAvg) / priorAvg
```

| pctChange | Trend label |
|---|---|
| ≥ +10% | Improving ↑ |
| ≤ −10% | Declining ↓ |
| between −10% and +10% | Stable → |

Edge cases: if `priorAvg === 0` and `currentAvg > 0` → **Improving**; both zero → **Stable**.

---

## Features Implemented

1. **Weekly Habit Completion** — horizontal progress bar, colour-coded (green ≥80%, amber ≥50%, red <50%), with motivational micro-copy.
2. **Weekly Water Progress** — radial ring + percentage vs weekly water target.
3. **Weekly Step Achievement** — radial ring + percentage vs weekly step target.
4. **Weekly Sleep Average** — radial ring + nightly average vs 8h reference.
5. **Weekly Exercise Total** — radial ring + minutes vs the plan's `weeklyExerciseMins`.
6. **Personal Bests** — 2×2 grid of all-time bests (water, steps, sleep, exercise) over the last 14 days.
7. **Trend Indicators** — appearing on every metric card: `TrendingUp`, `Minus`, or `TrendingDown` icon with a coloured pill.

---

## Dashboard Integration

The existing `/dashboard` page was updated:

| Before | After |
|---|---|
| "Progress: Good" (hardcoded) | Real `habitCompletionPct` with a `→ /dashboard/progress` link |
| "Weekly Streak: 2 Days" (hardcoded) | Real `activeDays / 7` count for the current week |

A **BottomNav** bar (`Today` / `Progress`) is now visible on both pages.

---

## Database Changes

**None.** M9 uses the `DailyCheckIn` records already written by M8 and the `HealthPlan` targets already saved during onboarding.

---

## How to Test

1. Ensure you are logged in and have completed onboarding (so a `HealthPlan` exists).
2. On the **Today** tab, log some metrics (water, steps, sleep, exercise, habits) across multiple days.
3. Navigate to `/dashboard/progress` (or tap **Progress** in the bottom nav).
4. Verify:
   - Habit completion bar reflects the percentage of logged days with all habits complete.
   - Metric cards show accurate weekly totals / percentages.
   - Personal bests update as you log higher values.
   - Trend badges flip between Improving / Stable / Declining as your weekly averages shift.
5. With **zero** check-in records, the Progress page shows the friendly empty state instead of broken data.

---

## Files Created / Modified

| File | Change |
|---|---|
| `src/features/progress/domain/progress-engine.ts` | **NEW** — pure computation engine |
| `src/features/progress/application/get-weekly-progress.ts` | **NEW** — Prisma query + engine call |
| `src/features/progress/presentation/ProgressDashboard.tsx` | **NEW** — page layout shell |
| `src/features/progress/presentation/WeeklySummaryCards.tsx` | **NEW** — 2×2 metric cards with SVG rings |
| `src/features/progress/presentation/HabitCompletionBar.tsx` | **NEW** — habit progress bar |
| `src/features/progress/presentation/PersonalBestsSection.tsx` | **NEW** — PB pills |
| `src/features/progress/presentation/TrendIndicator.tsx` | **NEW** — trend badge |
| `src/app/(protected)/dashboard/progress/page.tsx` | **NEW** — `/dashboard/progress` route |
| `src/components/BottomNav.tsx` | **NEW** — shared bottom nav |
| `src/app/(protected)/dashboard/page.tsx` | **MODIFIED** — real progress data + BottomNav |
