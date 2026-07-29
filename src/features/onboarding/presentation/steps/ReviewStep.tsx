import type { OnboardingFormData } from "@/features/onboarding/domain/types";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface ReviewStepProps {
  data: OnboardingFormData;
  onSubmit: () => void;
  onBack: () => void;
  onGoTo: (step: number) => void;
  isSubmitting: boolean;
  submitError: string;
}

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly Active",
  moderately_active: "Moderately Active",
  very_active: "Very Active",
  extra_active: "Extra Active",
};

const SMOKING_LABELS: Record<string, string> = {
  never: "Never smoked",
  former: "Former smoker",
  current: "Current smoker",
};

const ALCOHOL_LABELS: Record<string, string> = {
  none: "None",
  occasional: "Occasional",
  moderate: "Moderate",
  heavy: "Heavy",
};

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs text-violet-600 font-medium hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="px-4 py-3 space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs text-gray-700 text-right font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function ReviewStep({
  data,
  onSubmit,
  onBack,
  onGoTo,
  isSubmitting,
  submitError,
}: ReviewStepProps) {
  const { basicInfo, lifestyle, goals, healthConditions } = data;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please review your answers before submitting. You can go back to any step to make changes.
        </p>
      </div>

      <ReviewSection title="Basic Information" step={1} onEdit={onGoTo}>
        <Row label="Date of Birth" value={basicInfo.dateOfBirth} />
        <Row label="Gender" value={basicInfo.gender ? GENDER_LABELS[basicInfo.gender] : undefined} />
        <Row label="Height" value={basicInfo.heightCm ? `${basicInfo.heightCm} cm` : undefined} />
        <Row label="Weight" value={basicInfo.weightKg ? `${basicInfo.weightKg} kg` : undefined} />
      </ReviewSection>

      <ReviewSection title="Lifestyle" step={2} onEdit={onGoTo}>
        <Row
          label="Activity Level"
          value={lifestyle.activityLevel ? ACTIVITY_LABELS[lifestyle.activityLevel] : undefined}
        />
        <Row
          label="Smoking"
          value={lifestyle.smokingStatus ? SMOKING_LABELS[lifestyle.smokingStatus] : undefined}
        />
        <Row
          label="Alcohol"
          value={lifestyle.alcoholConsumption ? ALCOHOL_LABELS[lifestyle.alcoholConsumption] : undefined}
        />
        <Row label="Diet Type" value={lifestyle.dietType || "Not specified"} />
        <Row
          label="Sleep per Night"
          value={lifestyle.sleepHoursPerNight ? `${lifestyle.sleepHoursPerNight} hrs` : "Not specified"}
        />
      </ReviewSection>

      <ReviewSection title="Goals" step={3} onEdit={onGoTo}>
        {goals.goals && goals.goals.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {goals.goals.map((g) => (
              <span
                key={g}
                className="inline-block px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">None selected</span>
        )}
      </ReviewSection>

      <ReviewSection title="Health Conditions" step={4} onEdit={onGoTo}>
        {healthConditions.healthConditions && healthConditions.healthConditions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {healthConditions.healthConditions.map((c) => (
              <span
                key={c}
                className="inline-block px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">None selected</span>
        )}
        {healthConditions.additionalNotes && (
          <p className="text-xs text-gray-600 mt-2 border-t pt-2 border-gray-200">
            {healthConditions.additionalNotes}
          </p>
        )}
      </ReviewSection>

      {submitError && (
        <ErrorBanner>{submitError}</ErrorBanner>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting} className="flex-1">
          ← Back
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} isLoading={isSubmitting} className="flex-grow">
          {isSubmitting ? "Saving…" : "Submit Profile ✓"}
        </Button>
      </div>
    </div>
  );
}
