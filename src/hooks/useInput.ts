// CHANGED: Replaced Zod schema dependency with Yup schema
// This hook is a standalone per-field validator (not used by main forms,
// but exported from hooks/index.ts for potential consumer use).
//
// Before: import { ZodSchema } from "zod"  +  schema.safeParse(val)
// After:  import { Schema } from "yup"     +  schema.isValidSync(val) / validateSync()

import { ChangeEvent, useState } from "react";
import { Schema } from "yup";

interface UseInputOptions<T> {
  initialValue?: T;
  // CHANGED: schema type from ZodSchema<T> to Yup Schema<T>
  schema?: Schema<T>;       // optional per-field Yup schema for instant validation
  validateOnChange?: boolean;  // default: false — validate only on blur
}

interface UseInputReturn<T> {
  value: T;
  error: string;
  touched: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  reset: () => void;
  setValue: (value: T) => void;
  setError: (error: string) => void;
}

const useInput = <T extends string | number = string>({
  initialValue = "" as T,
  schema,
  validateOnChange = false,
}: UseInputOptions<T> = {}): UseInputReturn<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  // CHANGED: replaced schema.safeParse(val) (Zod) with schema.validateSync(val) (Yup)
  // Yup's validateSync throws on failure — we catch it to extract the message,
  // mirroring how the old code extracted result.error.issues[0]?.message.
  const validate = (val: T): string => {
    if (!schema) return "";
    try {
      schema.validateSync(val);
      return "";
    } catch (err: unknown) {
      if (err instanceof Error) return err.message;
      return "Invalid value";
    }
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const raw = e.target.value;
    const next = (typeof initialValue === "number" ? Number(raw) : raw) as T;
    setValue(next);

    if (validateOnChange && touched) {
      setError(validate(next));
    }
  };

  const onBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const reset = () => {
    setValue(initialValue);
    setError("");
    setTouched(false);
  };

  return {
    value,
    error,
    touched,
    onChange,
    onBlur,
    reset,
    setValue,
    setError,
  };
};

export default useInput;
