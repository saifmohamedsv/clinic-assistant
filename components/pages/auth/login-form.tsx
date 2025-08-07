"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/app/(auth)/actions/user";

import { useTranslations } from "next-intl";

import { redirect } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [isPending] = useTransition();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await signInAction(formData);
    if (result.success) redirect("/home");
    if (!result?.success) {
      setError(result.message);
    }
  }

  return (
    <form action={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("login.heading")}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t("login.subheading")}</p>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error || tCommon("error.unknown")}</div>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">{t("password")}</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              {t("forgotPassword")}
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t("loggingIn") : t("login.button")}
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={{ href: '/sign-up', locale }} className="underline underline-offset-4">
          Sign up
        </Link>
      </div> */}
    </form>
  );
}
