import { STEPS } from "@/features/onboarding/domain/types";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  // Steps 0 (Welcome) and 6 (Success) don't show numbered progress
  const progressSteps = STEPS.slice(1, 6); // steps 1-5
  const activeIndex = currentStep - 1; // offset by 1

  const progressPct =
    currentStep <= 0
      ? 0
      : currentStep >= 6
        ? 100
        : Math.round((activeIndex / (progressSteps.length - 1)) * 100);

  if (currentStep === 0 || currentStep === 6) return null;

  return (
    <div className="w-full mb-8">
      {/* Step labels */}
      <div className="flex justify-between mb-3">
        {progressSteps.map((label, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-violet-600 text-white ring-4 ring-violet-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium hidden sm:block text-center leading-tight max-w-[4rem] ${
                  isActive ? "text-violet-700" : isCompleted ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 bg-gray-100 rounded-full mx-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Step {currentStep} of 5
      </p>
    </div>
  );
}
