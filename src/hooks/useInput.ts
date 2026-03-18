import { ChangeEvent, useState } from "react";
import { ZodSchema } from "zod";

interface UseInputOptions<T> {
  initialValue?: T;
  schema?: ZodSchema<T>;       // optional per-field Zod schema for instant validation
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

  const validate = (val: T): string => {
    if (!schema) return "";
    const result = schema.safeParse(val);
    if (!result.success) {
      return result.error.issues[0]?.message ?? "Invalid value";
    }
    return "";
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const raw = e.target.value;
    // preserve number type if initialValue was a number
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