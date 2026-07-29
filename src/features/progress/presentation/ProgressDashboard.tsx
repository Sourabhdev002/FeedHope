import type { WeeklyProgressSummary } from "@/features/progress/domain/progress-engine";
import { WeeklySummaryCards } from "./WeeklySummaryCards";
import { HabitCompletionBar } from "./HabitCompletionBar";
import { PersonalBestsSection } from "./PersonalBestsSection";
import { BarChart2 } from "lucide-react";

interface ProgressDashboardProps {
  summary: WeeklyProgressSummary;
}

function formatWeekStart(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00Z");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function ProgressDashboard({ summary }: ProgressDashboardProps) {
  const weekLabel = formatWeekStart(summary.weekStart);

  return (
    <div>
      {/* Page sub-header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900">Weekly Progress</h2>
          </div>
          <p className="text-sm text-gray-400">
            Week of {weekLabel} &mdash; {summary.activeDays} day
            {summary.activeDays !== 1 ? "s" : ""} logged
          </p>
        </div>
      </div>

      {/* Habit completion bar */}
      <div className="mb-6">
        <HabitCompletionBar
          completionPct={summary.habitCompletionPct}
          activeDays={summary.activeDays}
          trend={summary.trends.habits}
        />
      </div>

      {/* 4-metric cards */}
      <WeeklySummaryCards summary={summary} />

      {/* Personal bests */}
      <PersonalBestsSection bests={summary.personalBests} />
    </div>
  );
}
