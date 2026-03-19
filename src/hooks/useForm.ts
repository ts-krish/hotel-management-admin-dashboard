import { FormEvent, useState } from "react";
import { ZodSchema } from "zod";

interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  schema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

type FieldErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FieldErrors<T>;
  formError: string;
  formSuccess: string;
  isSubmitting: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setFormError: (msg: string) => void;
  setFormSuccess: (msg: string) => void;
  setFieldValue: (name: keyof T, value: unknown) => void;
  reset: () => void;
}

const useForm = <T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // validate single field
  const validateField = (name: keyof T, currentValues: T): string => {
    const result = schema.safeParse(currentValues);
    if (!result.success) {
      const fieldIssue = result.error.issues.find((i) => i.path[0] === name);
      return fieldIssue?.message ?? "";
    }
    return "";
  };

  // validate all
  const validateAll = (currentValues: T): FieldErrors<T> => {
    const result = schema.safeParse(currentValues);

    if (!result.success) {
      return result.error.issues.reduce<FieldErrors<T>>((acc, issue) => {
        const key = issue.path[0] as keyof T;

        if (key && !acc[key]) {
          acc[key] = issue.message;
        }

        return acc;
      }, {});
    }

    return {};
  };

  const setFieldValue = (name: keyof T, value: unknown) => {
  const next = { ...values, [name]: value };
  setValues(next);
  if (touched[name]) {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }));
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    const key = name as keyof T;

    const next = {
      ...values,
      [key]: type === "number" ? Number(value) : value,
    };

    setValues(next);

    if (touched[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, next),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const key = e.target.name as keyof T;

    setTouched((prev) => ({ ...prev, [key]: true }));

    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, values),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");

    const allTouched = Object.keys(values).reduce<
      Partial<Record<keyof T, boolean>>
    >((acc, k) => {
      acc[k as keyof T] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    const fieldErrors = validateAll(values);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    formError,
    formSuccess,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormError,
    setFormSuccess,
    setFieldValue,
    reset,
  };
};

export default useForm;
