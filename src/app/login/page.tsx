"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useForm from "@/hooks/useForm";
import { LoginInput, loginSchema } from "@/modules/auth/auth.schema";
import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();

  const {
    values,
    errors,
    // CHANGED: destructure `touched` from useForm (new with Formik integration).
    // Formik only populates errors for a field after it has been blurred,
    // but we must also check `touched` before showing the error message so
    // we never flash validation errors on fields the user hasn't visited yet.
    touched,
    formError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginInput>({
    initialValues: { email: "", password: "" },
    schema: loginSchema,
    onSubmit: async (data) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(
          body?.error ?? "Invalid credentials. Please try again.",
        );
      }
      toast.success("Logged in successfully");
      router.push("/dashboard");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-600">
          <Building2 size={32} color="white" />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Hotel Admin
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sign in to manage your hotel operations
          </p>
        </div>

        {/* Card */}
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Form-level error — unchanged */}
              {formError && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@hotel.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // CHANGED: gate className and error message on `touched.email`
                  // so the red border only appears after the user has blurred the field.
                  // Before: className={errors.email ? "border-red-400 ..." : ""}
                  // After:  className={touched.email && errors.email ? "..." : ""}
                  className={
                    touched.email && errors.email
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {/* CHANGED: show error only when field is touched */}
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // CHANGED: gate on touched.password
                  className={
                    touched.password && errors.password
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {/* CHANGED: show error only when field is touched */}
                {touched.password && errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit — unchanged */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
