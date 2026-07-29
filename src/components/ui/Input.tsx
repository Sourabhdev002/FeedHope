import { type InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Optional unit label placed at the right inside the input (e.g. "cm", "kg") */
  suffix?: string;
  /** Additional class names for the outer wrapper div */
  wrapperClassName?: string;
}

/**
 * Design-system Input – single source of truth for all text / number / date / password inputs.
 *
 * Features: label, error state, suffix unit, consistent violet focus ring.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, suffix, wrapperClassName = "", className = "", id, ...props },
    ref
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={[
              // Layout
              "w-full px-4 py-3 text-sm",
              // Shape
              "rounded-xl border",
              // Colours
              "bg-gray-50 text-gray-900 placeholder-gray-400",
              // Border — error vs normal
              error
                ? "border-red-400 bg-red-50 focus:ring-red-400"
                : "border-gray-200 hover:border-gray-300 focus:ring-violet-400",
              // Focus
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              // Suffix padding
              suffix ? "pr-12" : "",
              // Transition
              "transition-colors duration-150",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
