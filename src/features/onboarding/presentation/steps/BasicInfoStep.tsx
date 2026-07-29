import { useState } from "react";
import { basicInfoSchema, type BasicInfoData } from "@/features/onboarding/domain/types";
import { Button } from "@/components/ui/Button";

interface BasicInfoStepProps {
  data: Partial<BasicInfoData>;
  onNext: (data: BasicInfoData) => void;
  onBack: () => void;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function BasicInfoStep({ data, onNext, onBack }: BasicInfoStepProps) {
  const [form, setForm] = useState({
    dateOfBirth: data.dateOfBirth ?? "",
    gender: data.gender ?? ("" as BasicInfoData["gender"]),
    heightCm: data.heightCm?.toString() ?? "",
    weightKg: data.weightKg?.toString() ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BasicInfoData, string>>>({});

  const handleSubmit = () => {
    const parsed = basicInfoSchema.safeParse({
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      heightCm: parseFloat(form.heightCm),
      weightKg: parseFloat(form.weightKg),
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BasicInfoData, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BasicInfoData;
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
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us a little about your physical profile.
        </p>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Date of Birth
        </label>
        <input
          type="date"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 ${
            errors.dateOfBirth ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
          value={form.dateOfBirth}
          onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
        />
        <FieldError message={errors.dateOfBirth} />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, gender: opt.value }))}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-150 ${
                form.gender === opt.value
                  ? "border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-400"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <FieldError message={errors.gender} />
      </div>

      {/* Height & Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Height
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="170"
              min={50}
              max={280}
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                errors.heightCm ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
              value={form.heightCm}
              onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
              cm
            </span>
          </div>
          <FieldError message={errors.heightCm} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Weight
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="70"
              min={20}
              max={500}
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                errors.weightKg ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
              value={form.weightKg}
              onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
              kg
            </span>
          </div>
          <FieldError message={errors.weightKg} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button onClick={handleSubmit} className="flex-2 flex-grow">
          Continue →
        </Button>
      </div>
    </div>
  );
}
