import { Flame } from "lucide-react";
import { TrendIndicator } from "./TrendIndicator";
import type { Trend } from "@/features/progress/domain/progress-engine";

interface HabitCompletionBarProps {
  completionPct: number;
  activeDays: number;
  trend: Trend;
}

export function HabitCompletionBar({
  completionPct,
  activeDays,
  trend,
}: HabitCompletionBarProps) {
  // Colour band based on percentage
  const barColor =
    completionPct >= 80
      ? "from-emerald-400 to-emerald-500"
      : completionPct >= 50
        ? "from-amber-400 to-amber-500"
        : "from-rose-400 to-rose-500";

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 rounded-xl">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Weekly Habits</p>
            <p className="text-xs text-gray-400">
              {activeDays} day{activeDays !== 1 ? "s" : ""} logged this week
            </p>
          </div>
        </div>
        <TrendIndicator trend={trend} />
      </div>

      {/* Percentage Label */}
      <div className="flex items-end gap-1 mb-3">
        <span className="text-4xl font-black text-slate-900">
          {completionPct}
        </span>
        <span className="text-lg font-semibold text-gray-400 mb-1">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
          style={{ width: `${completionPct}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {completionPct === 100
          ? "🎉 Perfect week! All habits completed."
          : completionPct >= 80
            ? "Great consistency — keep it going!"
            : completionPct >= 50
              ? "Solid effort. Try to stay consistent."
              : activeDays === 0
                ? "Start logging to see your progress."
                : "Every habit checked makes a difference."}
      </p>
    </div>
  );
}
