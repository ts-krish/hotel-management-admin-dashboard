import { FormHTMLAttributes, forwardRef } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  error?: string;        // top-level server/api error
  success?: string;      // top-level success message
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ error, success, children, className = "", ...props }, ref) => {
    return (
      <form
        ref={ref}
        noValidate                  // we handle validation via Zod, not native HTML
        className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}
        {...props}
      >
        {/* Top-level API error banner */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Top-level success banner */}
        {success && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        )}

        {children}
      </form>
    );
  },
);

Form.displayName = "Form";

export default Form;