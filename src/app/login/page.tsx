"use client";

import { Button, Form, Input } from "@/components/ui";
import useForm from "@/hooks/useForm";
import { LoginInput, loginSchema } from "@/modules/auth/auth.schema";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const {
    values,
    errors,
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

      router.push("/dashboard");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-xl bg-teal-600">
          <Building2 size={40} color="white" />
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Hotel Admin
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sign in to manage your hotel operations
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <Form onSubmit={handleSubmit} error={formError}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="admin@hotel.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
