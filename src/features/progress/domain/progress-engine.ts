/**
 * Progress Engine – M9
 *
 * Pure, deterministic, side-effect-free function.
 * No imports from Next.js, Prisma, or any async lib.
 * Safe to unit-test in isolation.
 */

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface CheckInRecord {
  checkInDate: Date;
  waterIntakeLitres: number;
  stepsCount: number;
  sleepHours: number;
  exerciseMins: number;
  completedHabits: string; // JSON array string
}

export interface PlanTargets {
  dailyWaterLitres: number;
  dailyStepTarget: number;
  sleepTargetHours: number;
  weeklyExerciseMins: number;
  habitChecklist: string; // JSON array string
}

// ─── Output Types ─────────────────────────────────────────────────────────────

export type Trend = "improving" | "stable" | "declining";

export interface MetricTrends {
  water: Trend;
  steps: Trend;
  sleep: Trend;
  exercise: Trend;
  habits: Trend;
}

export interface PersonalBests {
  waterLitres: number;
  stepsCount: number;
  sleepHours: number;
  exerciseMins: number;
  habitsCompletedCount: number;
}

export interface WeeklyProgressSummary {
  /** Days in the current week (Mon–today) that have a check-in record */
  activeDays: number;
  /** 0–100 percentage: how many logged days had ALL habits ticked */
  habitCompletionPct: number;
  /** 0–100 percentage: total water this week vs target */
  weeklyWaterPct: number;
  /** 0–100 percentage: total steps this week vs target */
  weeklyStepsPct: number;
  /** Average sleep hours for days that have a non-zero log (0 if no data) */
  avgSleepHours: number;
  /** Sum of exercise minutes logged in the current week */
  totalExerciseMins: number;
  /** Weekly exercise target (from plan) */
  weeklyExerciseTarget: number;
  /** All-time bests across the full 14-day window */
  personalBests: PersonalBests;
  /** Simple trend per metric: compare prior 7-day avg with current 7-day avg */
  trends: MetricTrends;
  /** ISO date string of the week start (Monday) */
  weekStart: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp100(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Returns the ISO date string (YYYY-MM-DD) of the Monday of the given date's week.
 */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sun, 1 = Mon …
  const diff = day === 0 ? -6 : 1 - day; // offset to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Computes a Trend by comparing the average of `prev` vs `curr` windows.
 * A ≥10% relative improvement = "improving", ≥10% drop = "declining",
 * otherwise "stable". Falls back to "stable" if no data.
 */
function computeTrend(prevValues: number[], currValues: number[]): Trend {
  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : arr.reduce((s, v) => s + v, 0) / arr.length;

  const prevAvg = avg(prevValues);
  const currAvg = avg(currValues);

  if (prevAvg === 0 && currAvg === 0) return "stable";
  if (prevAvg === 0) return "improving";

  const pctChange = (currAvg - prevAvg) / prevAvg;
  if (pctChange >= 0.1) return "improving";
  if (pctChange <= -0.1) return "declining";
  return "stable";
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

/**
 * Computes a weekly progress summary from check-in records.
 *
 * @param checkIns - Up to 14 days of check-in records (any order). The engine
 *                   uses the last 7 days as "this week" and the prior 7 days as
 *                   the comparison window for trend calculation.
 * @param plan     - The active health plan targets used for percentage calculations.
 * @param referenceDate - Optional "today" override (defaults to now) for testability.
 */
export function computeWeeklyProgress(
  checkIns: CheckInRecord[],
  plan: PlanTargets,
  referenceDate?: Date
): WeeklyProgressSummary {
  const now = referenceDate ?? new Date();
  const weekStart = getMondayOf(now);
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setUTCDate(weekStart.getUTCDate() - 7);

  // Parse plan targets
  const allHabits: string[] = (() => {
    try {
      return JSON.parse(plan.habitChecklist) as string[];
    } catch {
      return [];
    }
  })();
  const totalHabits = allHabits.length;

  // Partition check-ins into current week / previous week
  const thisWeek: CheckInRecord[] = [];
  const prevWeek: CheckInRecord[] = [];

  for (const ci of checkIns) {
    const d = new Date(ci.checkInDate);
    d.setUTCHours(0, 0, 0, 0);
    const ts = d.getTime();
    const weekStartTs = weekStart.getTime();
    const prevWeekStartTs = prevWeekStart.getTime();

    if (ts >= weekStartTs) {
      thisWeek.push(ci);
    } else if (ts >= prevWeekStartTs) {
      prevWeek.push(ci);
    }
  }

  // ── This-week aggregates ──────────────────────────────────────────────────

  const activeDays = thisWeek.length;

  // Habit completion: a day is "complete" when ALL habits are ticked.
  let habitCompleteDays = 0;
  for (const ci of thisWeek) {
    if (totalHabits === 0) {
      // No habits defined → count day as complete
      habitCompleteDays++;
    } else {
      try {
        const done = JSON.parse(ci.completedHabits) as string[];
        if (done.length >= totalHabits) habitCompleteDays++;
      } catch {
        // malformed JSON – skip
      }
    }
  }
  const habitCompletionPct =
    activeDays === 0
      ? 0
      : clamp100((habitCompleteDays / activeDays) * 100);

  // Water: total vs weekly target (daily × 7)
  const totalWater = thisWeek.reduce((s, ci) => s + ci.waterIntakeLitres, 0);
  const weeklyWaterTarget = plan.dailyWaterLitres * 7;
  const weeklyWaterPct =
    weeklyWaterTarget === 0 ? 0 : clamp100((totalWater / weeklyWaterTarget) * 100);

  // Steps: total vs weekly target (daily × 7)
  const totalSteps = thisWeek.reduce((s, ci) => s + ci.stepsCount, 0);
  const weeklyStepsTarget = plan.dailyStepTarget * 7;
  const weeklyStepsPct =
    weeklyStepsTarget === 0 ? 0 : clamp100((totalSteps / weeklyStepsTarget) * 100);

  // Sleep: average of days that have a non-zero log
  const sleepDays = thisWeek.filter((ci) => ci.sleepHours > 0);
  const avgSleepHours =
    sleepDays.length === 0
      ? 0
      : round1(
          sleepDays.reduce((s, ci) => s + ci.sleepHours, 0) / sleepDays.length
        );

  // Exercise: weekly total
  const totalExerciseMins = thisWeek.reduce((s, ci) => s + ci.exerciseMins, 0);
  const weeklyExerciseTarget = plan.weeklyExerciseMins;

  // ── Personal Bests (full 14-day window) ───────────────────────────────────

  const allWindow = [...thisWeek, ...prevWeek];

  const personalBests: PersonalBests = {
    waterLitres: round1(Math.max(0, ...allWindow.map((ci) => ci.waterIntakeLitres))),
    stepsCount: Math.max(0, ...allWindow.map((ci) => ci.stepsCount)),
    sleepHours: round1(Math.max(0, ...allWindow.map((ci) => ci.sleepHours))),
    exerciseMins: Math.max(0, ...allWindow.map((ci) => ci.exerciseMins)),
    habitsCompletedCount: (() => {
      let best = 0;
      for (const ci of allWindow) {
        try {
          const done = (JSON.parse(ci.completedHabits) as string[]).length;
          if (done > best) best = done;
        } catch {
          // skip
        }
      }
      return best;
    })(),
  };

  // ── Trends ────────────────────────────────────────────────────────────────

  const habitScore = (ci: CheckInRecord): number => {
    if (totalHabits === 0) return 100;
    try {
      const done = (JSON.parse(ci.completedHabits) as string[]).length;
      return (done / totalHabits) * 100;
    } catch {
      return 0;
    }
  };

  const trends: MetricTrends = {
    water: computeTrend(
      prevWeek.map((ci) => ci.waterIntakeLitres),
      thisWeek.map((ci) => ci.waterIntakeLitres)
    ),
    steps: computeTrend(
      prevWeek.map((ci) => ci.stepsCount),
      thisWeek.map((ci) => ci.stepsCount)
    ),
    sleep: computeTrend(
      prevWeek.filter((ci) => ci.sleepHours > 0).map((ci) => ci.sleepHours),
      thisWeek.filter((ci) => ci.sleepHours > 0).map((ci) => ci.sleepHours)
    ),
    exercise: computeTrend(
      prevWeek.map((ci) => ci.exerciseMins),
      thisWeek.map((ci) => ci.exerciseMins)
    ),
    habits: computeTrend(
      prevWeek.map(habitScore),
      thisWeek.map(habitScore)
    ),
  };

  return {
    activeDays,
    habitCompletionPct,
    weeklyWaterPct,
    weeklyStepsPct,
    avgSleepHours,
    totalExerciseMins,
    weeklyExerciseTarget,
    personalBests,
    trends,
    weekStart: toISODate(weekStart),
  };
}
