"use server";

import { headers } from "next/headers";
import { auth } from "@/features/auth/infrastructure/better-auth";
import { prisma } from "@/infrastructure/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

const metricSchema = z.object({
  metric: z.enum(["waterIntakeLitres", "stepsCount", "sleepHours", "exerciseMins"]),
  value: z.number().min(0).max(100000), // reasonable max limit
});

const habitSchema = z.object({
  habitName: z.string().min(1).max(200), // prevent massive strings
  isCompleted: z.boolean(),
});

/**
 * Gets or creates today's DailyCheckIn for the active HealthPlan
 */
async function getOrCreateTodayCheckIn(userId: string) {
  // 1. Get active health plan
  const plan = await prisma.healthPlan.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!plan) {
    throw new Error("No active health plan found.");
  }

  // 2. Determine today's date (UTC midnight for simplicity, or local date string)
  // To avoid timezone issues, we will just use JS Date but stripped to UTC midnight
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  // 3. Upsert DailyCheckIn
  const checkIn = await prisma.dailyCheckIn.upsert({
    where: {
      healthPlanId_checkInDate: {
        healthPlanId: plan.id,
        checkInDate: today,
      },
    },
    update: {},
    create: {
      healthPlanId: plan.id,
      checkInDate: today,
      waterIntakeLitres: 0,
      stepsCount: 0,
      sleepHours: 0,
      exerciseMins: 0,
      completedHabits: "[]",
    },
  });

  return checkIn;
}

export async function updateDailyMetricAction(
  metric: "waterIntakeLitres" | "stepsCount" | "sleepHours" | "exerciseMins",
  value: number
) {
  const parsed = metricSchema.safeParse({ metric, value });
  if (!parsed.success) {
    return { success: false, error: "Invalid metric data." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const checkIn = await getOrCreateTodayCheckIn(session.user.id);

    await prisma.dailyCheckIn.update({
      where: { id: checkIn.id },
      data: {
        [metric]: value,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[updateDailyMetricAction]", error);
    return { success: false, error: "Failed to update metric." };
  }
}

export async function toggleHabitAction(habitName: string, isCompleted: boolean) {
  const parsed = habitSchema.safeParse({ habitName, isCompleted });
  if (!parsed.success) {
    return { success: false, error: "Invalid habit data." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const checkIn = await getOrCreateTodayCheckIn(session.user.id);
    
    // Parse existing habits
    const currentHabits = JSON.parse(checkIn.completedHabits) as string[];
    
    let newHabits;
    if (isCompleted) {
      newHabits = Array.from(new Set([...currentHabits, habitName]));
    } else {
      newHabits = currentHabits.filter((h) => h !== habitName);
    }

    await prisma.dailyCheckIn.update({
      where: { id: checkIn.id },
      data: {
        completedHabits: JSON.stringify(newHabits),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[toggleHabitAction]", error);
    return { success: false, error: "Failed to toggle habit." };
  }
}
