# M6 – Health Plan Engine Walkthrough

## Overview
M6 adds a deterministic, rule-based health plan engine that automatically generates a personalised `HealthPlan` whenever a user completes the onboarding assessment. The plan is stored in the database and displayed on a fully redesigned dashboard.

---

## Architecture

```
src/features/health-plan/
  domain/
    engine.ts              — Pure rule engine (zero dependencies, testable)
  application/
    generate-plan.ts       — Bridges engine ↔ Prisma persistence layer
```

### Clean Architecture boundaries respected:
- **Domain** (`engine.ts`): No imports from Next.js, Prisma, or any framework. Pure TypeScript function.
- **Application** (`generate-plan.ts`): Loads data from DB, calls engine, writes result back. Infrastructure-aware but framework-agnostic.
- **Presentation** (`dashboard/page.tsx`): Reads persisted plan, renders UI. No business logic.

---

## Rule Engine (`engine.ts`)

The engine is a single exported function:

```typescript
generateHealthPlan(profile: EngineProfile, assessment: EngineAssessment): HealthPlanRecommendation
```

### Rules by Output

| Output | Rules applied |
|---|---|
| **Water (litres)** | `weight × 0.033`, min 1.5L, +0.5L if very/extra active, +0.3L if smoker, capped at 4.5L |
| **Sleep (hours)** | Age-based (NHS guidelines: 9hrs <18, 8hrs 18–64, 7.5hrs 65+), +0.5 for chronic conditions, adjusted by "Sleep better" goal |
| **Daily steps** | Activity-level map (6k–15k), +2k for weight loss / cardio goals, −2k for heart disease / arthritis |
| **Exercise (mins/week)** | Activity-level map (90–250), +30 for muscle/cardio goals, −30 for heart disease / asthma, min 60 |
| **Nutrition guidance** | Diet-type rules (veg/keto/balanced), condition rules (diabetes, hypertension, cholesterol), goal rules (weight loss, muscle, energy), alcohol warning |
| **Habit checklist** | Assembled from: always-on habits, lifestyle-driven habits, goal-driven habits, condition-driven habits — capped at 8 |

All rules are **deterministic**: identical inputs always produce identical outputs.

---

## Integration with Onboarding

The plan generation is **woven into the existing Prisma transaction** in `submitAssessmentAction`:

```
tx.healthProfile.create()
  → tx.healthAssessment.create()
    → generateAndSaveHealthPlan()   ← NEW
      → tx.healthPlan.create()
```

This means: if any step fails (DB connection, validation error), the **entire transaction rolls back** and no partial data is committed.

---

## Database Changes

`HealthPlan` model additions:
| Field | Type | Description |
|---|---|---|
| `dailyWaterLitres` | Float | Engine water target |
| `sleepTargetHours` | Float | Engine sleep target |
| `dailyStepTarget` | Int | Engine step goal |
| `weeklyExerciseMins` | Int | Engine exercise target |
| `nutritionGuidance` | String | Engine-generated guidance text |
| `habitChecklist` | String | JSON array of daily habit strings |

---

## Dashboard
The dashboard now shows:
- **Plan header card** — plan title, description, start date (gradient violet)
- **4 metric cards** — Water, Sleep, Steps, Exercise
- **Nutrition Guidance** — engine-generated personalised text
- **Daily Habit Checklist** — 5–8 contextual habits (checkboxes, not yet interactive — M7+)

---

## How to Test

1. Register a new account (or use an existing one without a plan)
2. Complete the 7-step onboarding wizard
3. On "Submit" at the Review step, the engine runs server-side
4. Navigate to `/dashboard` — the health plan is displayed immediately
5. Verify DB: `HealthPlan` table has one row with all engine outputs populated
