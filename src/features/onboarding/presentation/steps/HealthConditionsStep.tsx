import { useState } from "react";
import {
  AVAILABLE_CONDITIONS,
  healthConditionsSchema,
  type HealthConditionsData,
} from "@/features/onboarding/domain/types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HealthConditionsStepProps {
  data: Partial<HealthConditionsData>;
  onNext: (data: HealthConditionsData) => void;
  onBack: () => void;
}

export function HealthConditionsStep({ data, onNext, onBack }: HealthConditionsStepProps) {
  const [selected, setSelected] = useState<string[]>(data.healthConditions ?? []);
  const [notes, setNotes] = useState(data.additionalNotes ?? "");
  const [errors, setErrors] = useState<{ healthConditions?: string; additionalNotes?: string }>({});

  const toggle = (condition: string) => {
    setSelected((prev) => {
      if (condition === "None of the above") {
        return prev.includes(condition) ? [] : [condition];
      }
      const filtered = prev.filter((c) => c !== "None of the above");
      return filtered.includes(condition)
        ? filtered.filter((c) => c !== condition)
        : [...filtered, condition];
    });
    setErrors({});
  };

  const handleSubmit = () => {
    const parsed = healthConditionsSchema.safeParse({
      healthConditions: selected,
      additionalNotes: notes || undefined,
    });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof errors;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    onNext(parsed.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Health Conditions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select any conditions that apply to you. This helps personalise your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {AVAILABLE_CONDITIONS.map((condition) => {
          const isSelected = selected.includes(condition);
          const isNone = condition === "None of the above";
          return (
            <button
              key={condition}
              type="button"
              onClick={() => toggle(condition)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? isNone
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-400"
                    : "border-violet-500 bg-violet-50 ring-1 ring-violet-400"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? isNone
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-violet-500 bg-violet-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isSelected
                    ? isNone
                      ? "text-emerald-700"
                      : "text-violet-700"
                    : "text-gray-700"
                }`}
              >
                {condition}
              </span>
            </button>
          );
        })}
      </div>

      {errors.healthConditions && (
        <p className="text-xs text-red-500">{errors.healthConditions}</p>
      )}

      {/* Additional notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any other health information you'd like us to know..."
          maxLength={500}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="text-xs text-gray-400 text-right mt-1">{notes.length}/500</p>
        {errors.additionalNotes && (
          <p className="text-xs text-red-500">{errors.additionalNotes}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button onClick={handleSubmit} className="flex-grow">
          Continue →
        </Button>
      </div>
    </div>
  );
}
