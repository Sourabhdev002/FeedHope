import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    "bg-violet-600 text-white",
    "hover:bg-violet-700",
    "focus-visible:ring-violet-500",
    "disabled:bg-violet-300",
    "shadow-sm hover:shadow-md",
  ].join(" "),

  secondary: [
    "border border-gray-200 bg-white text-gray-700",
    "hover:bg-gray-50 hover:border-gray-300",
    "focus-visible:ring-violet-400",
    "disabled:opacity-50",
  ].join(" "),

  ghost: [
    "text-violet-600 bg-transparent underline-offset-2",
    "hover:underline hover:text-violet-700",
    "focus-visible:ring-violet-400",
    "disabled:opacity-50",
  ].join(" "),

  danger: [
    "border border-red-200 bg-white text-red-600",
    "hover:bg-red-50 hover:border-red-300",
    "focus-visible:ring-red-400",
    "disabled:opacity-50",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-xl",
};

/**
 * Design-system Button – single source of truth for all button variants.
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes:    sm | md | lg
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "lg",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          // Base
          "inline-flex items-center justify-center gap-2",
          "font-semibold transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Width
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
