import { forwardRef, InputHTMLAttributes } from "react";

type InputVariant = "default" | "error" | "success";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  variant?: InputVariant;
}

const variantStyles: Record<InputVariant, string> = {
  default:
    "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-800 focus:ring-zinc-800",
  error:
    "border-red-400 bg-red-50 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500",
  success:
    "border-emerald-400 bg-emerald-50 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      variant = "default",
      className = "",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    // auto-derive variant from error prop
    const resolvedVariant: InputVariant = error ? "error" : variant;

    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {props.required}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={[
            "w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm outline-none transition-all duration-150",
            "focus:ring-2 focus:ring-offset-0",
            disabled
              ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
              : variantStyles[resolvedVariant],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={resolvedVariant === "error"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600"
          >
            {error}
          </p>
        )}

        {/* Hint message — only shown when no error */}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;