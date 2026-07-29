"use server";

import { z } from "zod/v4";
import { headers } from "next/headers";
import { auth } from "@/features/auth/infrastructure/better-auth";
import { prisma } from "@/infrastructure/db/prisma";
import { generateAndSaveHealthPlan } from "@/features/health-plan/application/generate-plan";
import {
  basicInfoSchema,
  lifestyleSchema,
  goalsSchema,
  healthConditionsSchema,
} from "@/features/onboarding/domain/types";

const submitAssessmentSchema = z.object({
  basicInfo: basicInfoSchema,
  lifestyle: lifestyleSchema,
  goals: goalsSchema,
  healthConditions: healthConditionsSchema,
});

export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitAssessmentAction(
  data: SubmitAssessmentInput
): Promise<ActionResult> {
  // 1. Authenticate
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to submit." };
  }

  // 2. Server-side validation
  const parsed = submitAssessmentSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid data";
    return { success: false, error: firstError };
  }

  const { basicInfo, lifestyle, goals, healthConditions } = parsed.data;

  // 3. Prevent double-submission
  const existing = await prisma.healthProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return { success: false, error: "Health profile already exists." };
  }

  // 4. Persist in a transaction
  try {
    const profileId = await prisma.$transaction(async (tx) => {
      const profile = await tx.healthProfile.create({
        data: {
          userId: session.user.id,
          dateOfBirth: new Date(basicInfo.dateOfBirth),
          gender: basicInfo.gender,
          heightCm: basicInfo.heightCm,
          weightKg: basicInfo.weightKg,
          activityLevel: lifestyle.activityLevel,
          dietType: lifestyle.dietType ?? null,
          smokingStatus: lifestyle.smokingStatus,
          alcoholConsumption: lifestyle.alcoholConsumption,
          sleepHoursPerNight: lifestyle.sleepHoursPerNight ?? null,
        },
      });

      await tx.healthAssessment.create({
        data: {
          healthProfileId: profile.id,
          goals: JSON.stringify(goals.goals),
          healthConditions: JSON.stringify(healthConditions.healthConditions),
          additionalNotes: healthConditions.additionalNotes ?? null,
        },
      });

      return profile.id;
    });

    // Generate and persist the health plan independently
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await generateAndSaveHealthPlan(session.user.id, profileId, prisma as any);

    return { success: true };
  } catch (err) {
    console.error("[submitAssessmentAction]", err);
    return { success: false, error: "Failed to save. Please try again." };
  }
}
