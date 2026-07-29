import { useState } from "react";
import { lifestyleSchema, type LifestyleData } from "@/features/onboarding/domain/types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LifestyleStepProps {
  data: Partial<LifestyleData>;
  onNext: (data: LifestyleData) => void;
  onBack: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function SelectGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: { value: T; label: string; description?: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
              value === opt.value
                ? "border-violet-500 bg-violet-50 ring-1 ring-violet-400"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="flex-1">
              <span
                className={`text-sm font-medium ${value === opt.value ? "text-violet-700" : "text-gray-700"}`}
              >
                {opt.label}
              </span>
              {opt.description && (
                <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
              )}
            </div>
            {value === opt.value && (
              <Check className="w-4 h-4 text-violet-500 mt-0.5" strokeWidth={2.5} />
            )}
          </button>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function LifestyleStep({ data, onNext, onBack }: LifestyleStepProps) {
  const [form, setForm] = useState({
    activityLevel: data.activityLevel ?? ("" as LifestyleData["activityLevel"] | ""),
    dietType: data.dietType ?? "",
    smokingStatus: data.smokingStatus ?? ("" as LifestyleData["smokingStatus"] | ""),
    alcoholConsumption: data.alcoholConsumption ?? ("" as LifestyleData["alcoholConsumption"] | ""),
    sleepHoursPerNight: data.sleepHoursPerNight?.toString() ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LifestyleData, string>>>({});

  const handleSubmit = () => {
    const parsed = lifestyleSchema.safeParse({
      activityLevel: form.activityLevel || undefined,
      dietType: form.dietType || undefined,
      smokingStatus: form.smokingStatus || undefined,
      alcoholConsumption: form.alcoholConsumption || undefined,
      sleepHoursPerNight: form.sleepHoursPerNight ? parseFloat(form.sleepHoursPerNight) : undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LifestyleData, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LifestyleData;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(parsed.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lifestyle</h2>
        <p className="text-sm text-gray-500 mt-1">Help us understand your daily habits.</p>
      </div>

      <SelectGroup
        label="How active are you on a typical week?"
        value={form.activityLevel}
        onChange={(v) => setForm((f) => ({ ...f, activityLevel: v }))}
        error={errors.activityLevel}
        options={[
          { value: "sedentary", label: "Sedentary", description: "Little or no exercise" },
          { value: "lightly_active", label: "Lightly Active", description: "1–3 days/week" },
          { value: "moderately_active", label: "Moderately Active", description: "3–5 days/week" },
          { value: "very_active", label: "Very Active", description: "6–7 days/week" },
          { value: "extra_active", label: "Extra Active", description: "Physical job or twice-daily training" },
        ]}
      />

      <SelectGroup
        label="Do you smoke?"
        value={form.smokingStatus}
        onChange={(v) => setForm((f) => ({ ...f, smokingStatus: v }))}
        error={errors.smokingStatus}
        options={[
          { value: "never", label: "Never smoked" },
          { value: "former", label: "Former smoker" },
          { value: "current", label: "Current smoker" },
        ]}
      />

      <SelectGroup
        label="Alcohol consumption"
        value={form.alcoholConsumption}
        onChange={(v) => setForm((f) => ({ ...f, alcoholConsumption: v }))}
        error={errors.alcoholConsumption}
        options={[
          { value: "none", label: "None" },
          { value: "occasional", label: "Occasional", description: "A few drinks per month" },
          { value: "moderate", label: "Moderate", description: "1–2 drinks per day" },
          { value: "heavy", label: "Heavy", description: "3+ drinks per day" },
        ]}
      />

      {/* Optional fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Diet type <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Vegetarian, Keto, Balanced..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={form.dietType}
          onChange={(e) => setForm((f) => ({ ...f, dietType: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Average sleep per night <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="7"
            min={1}
            max={24}
            step={0.5}
            className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={form.sleepHoursPerNight}
            onChange={(e) => setForm((f) => ({ ...f, sleepHoursPerNight: e.target.value }))}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
            hours
          </span>
        </div>
        <FieldError message={errors.sleepHoursPerNight} />
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
