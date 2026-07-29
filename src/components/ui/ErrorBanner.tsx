import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorBannerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Design-system ErrorBanner – inline error alert used in forms.
 * Consistent across Login, Register, and Onboarding ReviewStep.
 */
export function ErrorBanner({ children, className = "" }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
