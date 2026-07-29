import { Droplets, Footprints, Moon, Dumbbell } from "lucide-react";
import { TrendIndicator } from "./TrendIndicator";
import type {
  WeeklyProgressSummary,
} from "@/features/progress/domain/progress-engine";

interface WeeklySummaryCardsProps {
  summary: WeeklyProgressSummary;
}

// ─── Radial Ring ──────────────────────────────────────────────────────────────

interface RadialRingProps {
  pct: number; // 0–100
  color: string; // stroke colour class (tailwind arbitrary)
  size?: number;
  strokeWidth?: number;
}

function RadialRing({
  pct,
  color,
  size = 56,
  strokeWidth = 5,
}: RadialRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(pct, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.7s ease" }}
      />
    </svg>
  );
}

// ─── Individual Metric Card ───────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  valueLabel: string;
  subLabel: string;
  pct: number;
  ringColor: string;
  trend: WeeklyProgressSummary["trends"]["water"];
  borderColorClass: string;
}

function MetricCard({
  icon,
  label,
  valueLabel,
  subLabel,
  pct,
  ringColor,
  trend,
  borderColorClass,
}: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border ${borderColorClass} flex flex-col gap-3`}
    >
      {/* Top row: icon + label */}
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-slate-800 text-sm">{label}</span>
      </div>

      {/* Middle row: ring + value */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <RadialRing pct={pct} color={ringColor} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
            {pct}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black text-slate-900 leading-tight truncate">
            {valueLabel}
          </p>
          <p className="text-xs text-gray-400 truncate">{subLabel}</p>
        </div>
      </div>

      {/* Bottom: trend */}
      <div>
        <TrendIndicator trend={trend} size="sm" />
      </div>
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function WeeklySummaryCards({ summary }: WeeklySummaryCardsProps) {
  const exercisePct = summary.weeklyExerciseTarget === 0
    ? 0
    : Math.min(100, Math.round((summary.totalExerciseMins / summary.weeklyExerciseTarget) * 100));

  const sleepPct = summary.avgSleepHours === 0
    ? 0
    : Math.min(100, Math.round((summary.avgSleepHours / 8) * 100)); // 8h = 100% reference

  const cards: MetricCardProps[] = [
    {
      label: "Water",
      icon: (
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Droplets className="w-4 h-4 text-blue-500" />
        </div>
      ),
      valueLabel: `${summary.weeklyWaterPct}%`,
      subLabel: "of weekly target",
      pct: summary.weeklyWaterPct,
      ringColor: "#3b82f6",
      trend: summary.trends.water,
      borderColorClass: "border-blue-50/60",
    },
    {
      label: "Steps",
      icon: (
        <div className="p-1.5 bg-emerald-50 rounded-lg">
          <Footprints className="w-4 h-4 text-emerald-500" />
        </div>
      ),
      valueLabel: `${summary.weeklyStepsPct}%`,
      subLabel: "of weekly target",
      pct: summary.weeklyStepsPct,
      ringColor: "#10b981",
      trend: summary.trends.steps,
      borderColorClass: "border-emerald-50/60",
    },
    {
      label: "Sleep Avg",
      icon: (
        <div className="p-1.5 bg-indigo-50 rounded-lg">
          <Moon className="w-4 h-4 text-indigo-500" />
        </div>
      ),
      valueLabel:
        summary.avgSleepHours > 0 ? `${summary.avgSleepHours}h` : "—",
      subLabel: "nightly average",
      pct: sleepPct,
      ringColor: "#6366f1",
      trend: summary.trends.sleep,
      borderColorClass: "border-indigo-50/60",
    },
    {
      label: "Exercise",
      icon: (
        <div className="p-1.5 bg-orange-50 rounded-lg">
          <Dumbbell className="w-4 h-4 text-orange-500" />
        </div>
      ),
      valueLabel: `${summary.totalExerciseMins}m`,
      subLabel: `of ${summary.weeklyExerciseTarget}m target`,
      pct: exercisePct,
      ringColor: "#f97316",
      trend: summary.trends.exercise,
      borderColorClass: "border-orange-50/60",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-3">This Week</h2>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
