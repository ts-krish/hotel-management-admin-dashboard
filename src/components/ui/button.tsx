import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-zinc-700 focus-visible:ring-zinc-800",
  secondary:
    "bg-white text-zinc-800 border border-zinc-300 hover:bg-zinc-50 focus-visible:ring-zinc-400",
  ghost:
    "bg-transparent text-zinc-700 border border-transparent hover:bg-zinc-100 focus-visible:ring-zinc-400",
  danger:
    "bg-red-600 text-white border border-red-600 hover:bg-red-700 focus-visible:ring-red-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-all duration-150 outline-none",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {/* Spinner */}
        {loading && <p></p>}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;