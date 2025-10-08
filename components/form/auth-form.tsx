"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction } from "@/app/(auth)/actions/user";
import { Role } from "@/types/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

type AuthMode = "signin" | "signup";

interface AuthFormProps extends React.ComponentProps<"form"> {
  mode: AuthMode;
}

export function AuthForm({ mode, className, ...props }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending] = useTransition();

  // Translations (best-effort; fallback to sensible defaults if keys are missing)
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  async function handleSubmit(formData: FormData) {
    setError(null);

    if (mode === "signin") {
      const result = await signInAction(formData);
      if (result?.success) redirect("/home");
      if (!result?.success) setError(result?.message || tCommon("error.unknown"));
      return;
    }

    // signup flow
    const result = await signUpAction(formData);
    if (result?.success) {
      await signInAction(formData);
      redirect("/home");
    }
    if (!result?.success) setError(result?.message || tCommon("error.unknown"));
  }

  const isSignup = mode === "signup";

  return (
    <form action={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{isSignup ? "Create your account" : tAuth("login.heading")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {isSignup ? "Enter your details below to sign up for an account" : tAuth("login.subheading")}
        </p>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error || tCommon("error.unknown")}</div>}

      <div className="grid gap-6">
        {isSignup && (
          <div className="grid gap-3">
            <Label htmlFor="name">{"Name"}</Label>
            <Input id="name" name="name" type="text" placeholder="Saif Mohamed" required />
          </div>
        )}

        <div className="grid gap-3">
          <Label htmlFor="email">{isSignup ? "Email" : tAuth("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={isSignup ? "m@example.com" : tAuth("emailPlaceholder")}
            required
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">{isSignup ? "Password" : tAuth("password")}</Label>
            {!isSignup && (
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                {tAuth("forgotPassword")}
              </a>
            )}
          </div>
          <Input id="password" name="password" type="password" required />
        </div>

        {isSignup && (
          <div className="grid gap-3">
            <Label htmlFor="role">{"Role"}</Label>
            <select id="role" name="role" required className="border rounded px-3 py-2">
              <option value="">Select a role</option>
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (isSignup ? "Signing up..." : tAuth("loggingIn")) : isSignup ? "Sign up" : tAuth("login.button")}
        </Button>
      </div>

      <div className="text-center text-sm">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href={"/sign-in"} className="underline underline-offset-4">
              Login
            </Link>
          </>
        ) : (
          <>{/* Sign up link intentionally commented; enable when needed */}</>
        )}
      </div>
    </form>
  );
}

export default AuthForm;
