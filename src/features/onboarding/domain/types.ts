import { z } from "zod/v4";

// ─── Step 2: Basic Information ────────────────────────────────────────────────

export const basicInfoSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return !isNaN(date.getTime()) && age >= 13 && age <= 120;
    }, "Please enter a valid date of birth (must be 13+)"),
  gender: z.enum(["male", "female", "non_binary", "prefer_not_to_say"], {
    error: "Please select a gender",
  }),
  heightCm: z
    .number({ error: "Height is required" })
    .min(50, "Height must be at least 50 cm")
    .max(280, "Height must be at most 280 cm"),
  weightKg: z
    .number({ error: "Weight is required" })
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be at most 500 kg"),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;

// ─── Step 3: Lifestyle ────────────────────────────────────────────────────────

export const lifestyleSchema = z.object({
  activityLevel: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"],
    { error: "Please select an activity level" }
  ),
  dietType: z.string().optional(),
  smokingStatus: z.enum(["never", "former", "current"], {
    error: "Please select a smoking status",
  }),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "heavy"], {
    error: "Please select alcohol consumption",
  }),
  sleepHoursPerNight: z
    .number()
    .min(1, "Sleep must be at least 1 hour")
    .max(24, "Sleep cannot exceed 24 hours")
    .optional(),
});

export type LifestyleData = z.infer<typeof lifestyleSchema>;

// ─── Step 4: Goals ────────────────────────────────────────────────────────────

export const AVAILABLE_GOALS = [
  "Lose weight",
  "Build muscle",
  "Improve energy levels",
  "Sleep better",
  "Reduce stress",
  "Improve cardiovascular health",
  "Eat healthier",
  "Manage a chronic condition",
  "Increase flexibility",
  "Improve mental health",
] as const;

export const goalsSchema = z.object({
  goals: z
    .array(z.string())
    .min(1, "Please select at least one goal")
    .max(5, "Please select no more than 5 goals"),
});

export type GoalsData = z.infer<typeof goalsSchema>;

// ─── Step 5: Health Conditions ────────────────────────────────────────────────

export const AVAILABLE_CONDITIONS = [
  "Diabetes (Type 1)",
  "Diabetes (Type 2)",
  "Hypertension (High Blood Pressure)",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Thyroid Disorder",
  "High Cholesterol",
  "Depression or Anxiety",
  "None of the above",
] as const;

export const healthConditionsSchema = z.object({
  healthConditions: z.array(z.string()).min(1, "Please select at least one option"),
  additionalNotes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type HealthConditionsData = z.infer<typeof healthConditionsSchema>;

// ─── Complete Wizard Data ─────────────────────────────────────────────────────

export interface OnboardingFormData {
  basicInfo: Partial<BasicInfoData>;
  lifestyle: Partial<LifestyleData>;
  goals: Partial<GoalsData>;
  healthConditions: Partial<HealthConditionsData>;
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
  basicInfo: {},
  lifestyle: {},
  goals: { goals: [] },
  healthConditions: { healthConditions: [] },
};

export const STEPS = [
  "Welcome",
  "Basic Information",
  "Lifestyle",
  "Goals",
  "Health Conditions",
  "Review",
  "Success",
] as const;

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
