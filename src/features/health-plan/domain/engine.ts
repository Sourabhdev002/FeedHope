/**
 * Health Plan Rule Engine
 *
 * Pure, deterministic, side-effect-free function.
 * No imports from Next.js, Prisma, or any async lib.
 * Safe to unit-test in isolation.
 */

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface EngineProfile {
  weightKg: number;
  heightCm: number;
  dateOfBirth: Date;
  gender: string;
  activityLevel: string;
  dietType?: string | null;
  smokingStatus: string;
  alcoholConsumption: string;
  sleepHoursPerNight?: number | null;
}

export interface EngineAssessment {
  goals: string[];
  healthConditions: string[];
}

export interface HealthPlanRecommendation {
  title: string;
  description: string;
  dailyWaterLitres: number;
  sleepTargetHours: number;
  dailyStepTarget: number;
  weeklyExerciseMins: number;
  nutritionGuidance: string;
  habitChecklist: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateAge(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function hasCondition(conditions: string[], keyword: string): boolean {
  return conditions.some((c) => c.toLowerCase().includes(keyword.toLowerCase()));
}

function hasGoal(goals: string[], keyword: string): boolean {
  return goals.some((g) => g.toLowerCase().includes(keyword.toLowerCase()));
}

// ─── Rule Modules ─────────────────────────────────────────────────────────────

function computeWaterTarget(profile: EngineProfile): number {
  // Base: 33ml per kg of body weight
  const base = profile.weightKg * 0.033;
  let target = Math.max(1.5, base);

  // Add 0.5L for very/extra active users
  if (["very_active", "extra_active"].includes(profile.activityLevel)) {
    target += 0.5;
  }

  // Add 0.3L for smokers (dehydration risk)
  if (profile.smokingStatus === "current") {
    target += 0.3;
  }

  return round1(Math.min(target, 4.5)); // cap at 4.5L
}

function computeSleepTarget(
  profile: EngineProfile,
  assessment: EngineAssessment
): number {
  const age = calculateAge(profile.dateOfBirth);

  // Age-based baseline (NHS / Sleep Foundation guidelines)
  let base: number;
  if (age < 18) base = 9;
  else if (age <= 64) base = 8;
  else base = 7.5;

  // Conditions that demand more recovery sleep
  if (
    hasCondition(assessment.healthConditions, "Diabetes") ||
    hasCondition(assessment.healthConditions, "Heart Disease") ||
    hasCondition(assessment.healthConditions, "Depression")
  ) {
    base = Math.min(base + 0.5, 9);
  }

  // If they already sleep well, nudge to optimal
  if (profile.sleepHoursPerNight && profile.sleepHoursPerNight >= base) {
    return base; // target = current (they're doing great)
  }

  // Prioritised goal
  if (hasGoal(assessment.goals, "Sleep better")) {
    base = Math.min(base + 0.5, 9);
  }

  return round1(base);
}

function computeStepTarget(profile: EngineProfile, assessment: EngineAssessment): number {
  const baseByActivity: Record<string, number> = {
    sedentary: 6000,
    lightly_active: 8000,
    moderately_active: 10000,
    very_active: 12000,
    extra_active: 15000,
  };

  let steps = baseByActivity[profile.activityLevel] ?? 8000;

  // Boost if weight loss or cardiovascular health is a goal
  if (
    hasGoal(assessment.goals, "Lose weight") ||
    hasGoal(assessment.goals, "cardiovascular")
  ) {
    steps = Math.min(steps + 2000, 15000);
  }

  // Reduce for heart disease or arthritis — safety-first
  if (
    hasCondition(assessment.healthConditions, "Heart Disease") ||
    hasCondition(assessment.healthConditions, "Arthritis")
  ) {
    steps = Math.max(steps - 2000, 4000);
  }

  return steps;
}

function computeExerciseTarget(
  profile: EngineProfile,
  assessment: EngineAssessment
): number {
  // WHO recommendation: 150 mins moderate / 75 mins vigorous per week minimum
  const baseByActivity: Record<string, number> = {
    sedentary: 90,
    lightly_active: 120,
    moderately_active: 150,
    very_active: 200,
    extra_active: 250,
  };

  let mins = baseByActivity[profile.activityLevel] ?? 120;

  if (
    hasGoal(assessment.goals, "Build muscle") ||
    hasGoal(assessment.goals, "Improve cardiovascular")
  ) {
    mins = Math.min(mins + 30, 300);
  }

  // Dial back for medical conditions
  if (
    hasCondition(assessment.healthConditions, "Heart Disease") ||
    hasCondition(assessment.healthConditions, "Asthma")
  ) {
    mins = Math.max(mins - 30, 60);
  }

  return mins;
}

function computeNutritionGuidance(
  profile: EngineProfile,
  assessment: EngineAssessment
): string {
  const lines: string[] = [];

  // Diet-type specific guidance
  const diet = profile.dietType?.toLowerCase() ?? "";
  if (diet.includes("veg") || diet.includes("vegan")) {
    lines.push(
      "Ensure adequate protein intake through legumes, tofu, tempeh, and fortified foods."
    );
    lines.push("Consider B12, iron, and omega-3 supplementation.");
  } else if (diet.includes("keto")) {
    lines.push(
      "Maintain electrolyte balance — sodium, potassium, and magnesium are commonly depleted."
    );
    lines.push("Prioritise healthy fats: avocado, olive oil, nuts, and fatty fish.");
  } else {
    lines.push(
      "Aim for a balanced plate: half vegetables, one-quarter lean protein, one-quarter whole grains."
    );
  }

  // Condition-specific rules
  if (hasCondition(assessment.healthConditions, "Diabetes")) {
    lines.push(
      "Monitor carbohydrate intake carefully. Prefer low-GI foods and avoid sugary drinks."
    );
  }
  if (hasCondition(assessment.healthConditions, "Hypertension")) {
    lines.push(
      "Reduce sodium intake to under 2,300 mg/day. Increase potassium-rich foods like bananas and spinach."
    );
  }
  if (hasCondition(assessment.healthConditions, "High Cholesterol")) {
    lines.push(
      "Limit saturated fats. Increase soluble fibre from oats, beans, and fruit."
    );
  }

  // Goal-specific additions
  if (hasGoal(assessment.goals, "Lose weight")) {
    lines.push(
      "Create a moderate calorie deficit by reducing processed snacks and increasing fibre-rich foods to stay fuller longer."
    );
  }
  if (hasGoal(assessment.goals, "Build muscle")) {
    lines.push(
      "Target 1.6–2.2g of protein per kg of body weight daily. Spread intake across 4+ meals."
    );
  }
  if (hasGoal(assessment.goals, "Improve energy")) {
    lines.push(
      "Eat consistent meals every 3–4 hours. Avoid large blood-sugar spikes from refined carbohydrates."
    );
  }

  // Alcohol advice
  if (profile.alcoholConsumption === "heavy") {
    lines.push(
      "Heavy alcohol consumption significantly impacts nutrient absorption and liver health. Consider speaking to a healthcare provider."
    );
  } else if (profile.alcoholConsumption === "moderate") {
    lines.push("Limit alcohol to recommended guidelines: max 14 units/week spread across the week.");
  }

  return lines.join(" ");
}

function computeHabitChecklist(
  profile: EngineProfile,
  assessment: EngineAssessment,
  waterLitres: number,
  stepTarget: number
): string[] {
  const habits: string[] = [];

  // Always present
  habits.push(`Drink ${waterLitres}L of water throughout the day`);
  habits.push(`Reach ${stepTarget.toLocaleString()} steps`);
  habits.push("Eat at least 5 portions of fruit and vegetables");
  habits.push("Avoid screens for 30 minutes before bed");

  // Lifestyle-driven
  if (
    profile.activityLevel === "sedentary" ||
    profile.activityLevel === "lightly_active"
  ) {
    habits.push("Take a 10-minute walk after each main meal");
  }

  if (profile.smokingStatus === "current") {
    habits.push("Track your smoking and aim to reduce by one cigarette per day");
  }

  if (profile.alcoholConsumption === "heavy" || profile.alcoholConsumption === "moderate") {
    habits.push("Log your alcohol units and aim to stay within weekly guidelines");
  }

  // Goal-driven
  if (hasGoal(assessment.goals, "Sleep better")) {
    habits.push("Set a consistent sleep schedule — same bedtime and wake-up every day");
  }

  if (hasGoal(assessment.goals, "Reduce stress")) {
    habits.push("Spend 10 minutes on mindfulness, meditation, or deep breathing");
  }

  if (hasGoal(assessment.goals, "Build muscle") || hasGoal(assessment.goals, "Improve energy")) {
    habits.push("Complete your scheduled workout or active recovery session");
  }

  // Condition-driven
  if (hasCondition(assessment.healthConditions, "Diabetes")) {
    habits.push("Check blood sugar levels as prescribed by your healthcare provider");
  }
  if (hasCondition(assessment.healthConditions, "Hypertension")) {
    habits.push("Spend 5 minutes on slow, deep-breathing exercises to support blood pressure");
  }

  // Cap at 8 habits for usability
  return habits.slice(0, 8);
}

function buildTitle(assessment: EngineAssessment): string {
  const primaryGoal = assessment.goals[0];
  if (!primaryGoal) return "Your Personalised Health Plan";
  return `Health Plan: ${primaryGoal}`;
}

function buildDescription(profile: EngineProfile, assessment: EngineAssessment): string {
  const age = calculateAge(profile.dateOfBirth);
  const goalList = assessment.goals.slice(0, 3).join(", ");
  return `A personalised ${assessment.goals.length}-goal plan tailored for a ${age}-year-old with ${profile.activityLevel.replace(/_/g, " ")} activity level, focused on: ${goalList}.`;
}

// ─── Main Engine Function ─────────────────────────────────────────────────────

export function generateHealthPlan(
  profile: EngineProfile,
  assessment: EngineAssessment
): HealthPlanRecommendation {
  const dailyWaterLitres = computeWaterTarget(profile);
  const sleepTargetHours = computeSleepTarget(profile, assessment);
  const dailyStepTarget = computeStepTarget(profile, assessment);
  const weeklyExerciseMins = computeExerciseTarget(profile, assessment);
  const nutritionGuidance = computeNutritionGuidance(profile, assessment);
  const habitChecklist = computeHabitChecklist(
    profile,
    assessment,
    dailyWaterLitres,
    dailyStepTarget
  );

  return {
    title: buildTitle(assessment),
    description: buildDescription(profile, assessment),
    dailyWaterLitres,
    sleepTargetHours,
    dailyStepTarget,
    weeklyExerciseMins,
    nutritionGuidance,
    habitChecklist,
  };
}
