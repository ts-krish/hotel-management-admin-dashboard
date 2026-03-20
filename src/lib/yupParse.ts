// NEW FILE: yupParse.ts
//
// Provides a helper that mirrors Zod's safeParse() API for use in API route handlers.
//
// Zod pattern (old):
//   const parsed = schema.safeParse(body);
//   if (!parsed.success) return error response using parsed.error.issues
//   use parsed.data
//
// Yup pattern (new) using this helper:
//   const parsed = await yupParse(schema, body);
//   if (!parsed.success) return error response using parsed.errors
//   use parsed.data
//
// This keeps all route files clean and consistent.

import { AnyObject, ObjectSchema, ValidationError } from "yup";

type YupParseSuccess<T> = { success: true; data: T };
type YupParseFailure = {
  success: false;
  errors: { message: string; path: string | undefined }[];
};
type YupParseResult<T> = YupParseSuccess<T> | YupParseFailure;

export async function yupParse<T extends AnyObject>(
  schema: ObjectSchema<T>,
  input: unknown,
): Promise<YupParseResult<T>> {
  try {
    // abortEarly: false → collect ALL errors (mirrors Zod's default behaviour)
    // stripUnknown: true → drop extra fields (mirrors Zod's strip mode)
    const data = await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    return { success: true, data: data as T };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors =
        err.inner.length > 0
          ? err.inner.map((e) => ({ message: e.message, path: e.path }))
          : // When there's only one error, err.inner is empty and the error is on err itself
            [{ message: err.message, path: err.path }];
      return { success: false, errors };
    }
    throw err; // re-throw unexpected errors
  }
}
