import { useState } from "react";
import {
  AVAILABLE_GOALS,
  goalsSchema,
  type GoalsData,
} from "@/features/onboarding/domain/types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GoalsStepProps {
  data: Partial<GoalsData>;
  onNext: (data: GoalsData) => void;
  onBack: () => void;
}

export function GoalsStep({ data, onNext, onBack }: GoalsStepProps) {
  const [selected, setSelected] = useState<string[]>(data.goals ?? []);
  const [error, setError] = useState<string>("");

  const toggle = (goal: string) => {
    setSelected((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    setError("");
  };

  const handleSubmit = () => {
    const parsed = goalsSchema.safeParse({ goals: selected });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid selection");
      return;
    }
    onNext(parsed.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select up to 5 goals that matter most to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {AVAILABLE_GOALS.map((goal) => {
          const isSelected = selected.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              onClick={() => toggle(goal)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? "border-violet-500 bg-violet-50 ring-1 ring-violet-400"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "border-violet-500 bg-violet-500" : "border-gray-300"
                }`}
              >
              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              <span
                className={`text-sm font-medium ${isSelected ? "text-violet-700" : "text-gray-700"}`}
              >
                {goal}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <p className="text-xs text-gray-400">
        {selected.length}/5 goals selected
      </p>

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
