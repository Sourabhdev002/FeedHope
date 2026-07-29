import type { ReactNode } from "react";

type BadgeVariant = "violet" | "emerald" | "gray" | "rose" | "amber" | "blue";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  violet: "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  gray: "bg-gray-200 text-gray-700",
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
};

/**
 * Design-system Badge / Tag – inline pill label.
 * Replaces the ad-hoc pill spans in ReviewStep and ProgressDashboard.
 */
export function Badge({ children, variant = "gray", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
