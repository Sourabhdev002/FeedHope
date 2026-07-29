import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import type { Trend } from "@/features/progress/domain/progress-engine";

interface TrendIndicatorProps {
  trend: Trend;
  /** Optional size variant */
  size?: "sm" | "md";
}

const config: Record<
  Trend,
  { label: string; color: string; bgColor: string; Icon: typeof TrendingUp }
> = {
  improving: {
    label: "Improving",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    Icon: TrendingUp,
  },
  stable: {
    label: "Stable",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    Icon: ArrowRight,
  },
  declining: {
    label: "Declining",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    Icon: TrendingDown,
  },
};

export function TrendIndicator({ trend, size = "sm" }: TrendIndicatorProps) {
  const { label, color, bgColor, Icon } = config[trend];
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${bgColor} ${color} ${textSize}`}
    >
      <Icon className={iconSize} strokeWidth={2.5} />
      {label}
    </span>
  );
}
