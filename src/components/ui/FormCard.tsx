import type { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Design-system FormCard – white card container used on auth and onboarding screens.
 * Matches the radius / shadow / border language of dashboard cards.
 */
export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-modal overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
