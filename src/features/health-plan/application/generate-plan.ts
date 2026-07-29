import type { PrismaClient } from "@/generated/prisma/client";
import { generateHealthPlan } from "@/features/health-plan/domain/engine";

type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

/**
 * Generates and persists a HealthPlan for a user inside an existing Prisma
 * transaction. Called atomically from the onboarding submission action.
 *
 * @param userId  - The authenticated user's ID
 * @param profileId - The newly created HealthProfile ID
 * @param tx      - Active Prisma transaction client
 */
export async function generateAndSaveHealthPlan(
  userId: string,
  profileId: string,
  tx: TransactionClient
): Promise<void> {
  // Load the just-created profile and assessment from within the transaction
  const profile = await tx.healthProfile.findUniqueOrThrow({
    where: { id: profileId },
  });

  const assessment = await tx.healthAssessment.findFirstOrThrow({
    where: { healthProfileId: profileId },
    orderBy: { createdAt: "desc" },
  });

  // Parse JSON fields from assessment
  const goals: string[] = JSON.parse(assessment.goals);
  const healthConditions: string[] = JSON.parse(assessment.healthConditions);

  // Run the pure rule engine
  const recommendation = generateHealthPlan(
    {
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      dietType: profile.dietType,
      smokingStatus: profile.smokingStatus,
      alcoholConsumption: profile.alcoholConsumption,
      sleepHoursPerNight: profile.sleepHoursPerNight,
    },
    { goals, healthConditions }
  );

  // Persist the generated plan
  await tx.healthPlan.create({
    data: {
      userId,
      title: recommendation.title,
      description: recommendation.description,
      startDate: new Date(),
      isActive: true,
      dailyWaterLitres: recommendation.dailyWaterLitres,
      sleepTargetHours: recommendation.sleepTargetHours,
      dailyStepTarget: recommendation.dailyStepTarget,
      weeklyExerciseMins: recommendation.weeklyExerciseMins,
      nutritionGuidance: recommendation.nutritionGuidance,
      habitChecklist: JSON.stringify(recommendation.habitChecklist),
    },
  });
}
