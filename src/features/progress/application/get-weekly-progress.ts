import { prisma } from "@/infrastructure/db/prisma";
import type { HealthPlan } from "@/generated/prisma/client";
import {
  computeWeeklyProgress,
  type WeeklyProgressSummary,
} from "@/features/progress/domain/progress-engine";

/**
 * Fetches the last 14 DailyCheckIn records for the user's active HealthPlan
 * and runs them through the progress engine.
 *
 * Returns `null` when:
 *  - The user has no active plan.
 *  - There are no check-in records at all.
 */
export async function getWeeklyProgress(
  userId: string,
  prefetchedPlan?: HealthPlan
): Promise<WeeklyProgressSummary | null> {
  // 1. Resolve the active plan
  const plan = prefetchedPlan || await prisma.healthPlan.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!plan) return null;

  // 2. Fetch the last 14 days of check-ins (ordered newest first)
  const checkIns = await prisma.dailyCheckIn.findMany({
    where: { healthPlanId: plan.id },
    orderBy: { checkInDate: "desc" },
    take: 14,
  });

  if (checkIns.length === 0) return null;

  // 3. Map Prisma rows → engine input type
  const engineInput = checkIns.map((ci) => ({
    checkInDate: ci.checkInDate,
    waterIntakeLitres: ci.waterIntakeLitres,
    stepsCount: ci.stepsCount,
    sleepHours: ci.sleepHours,
    exerciseMins: ci.exerciseMins,
    completedHabits: ci.completedHabits,
  }));

  const planTargets = {
    dailyWaterLitres: plan.dailyWaterLitres,
    dailyStepTarget: plan.dailyStepTarget,
    sleepTargetHours: plan.sleepTargetHours,
    weeklyExerciseMins: plan.weeklyExerciseMins,
    habitChecklist: plan.habitChecklist,
  };

  // 4. Run pure computation
  return computeWeeklyProgress(engineInput, planTargets);
}
