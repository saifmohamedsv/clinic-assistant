"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction } from "@/app/(auth)/actions/user";
import { Role } from "@/types/roles";
import { redirect } from "next/navigation";

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [isPending] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await signUpAction(formData);
    // You may want to handle success or error here

    if (result.success) {
      await signInAction(formData);
      redirect("/home");
    }

    if (!result?.success) {
      setError(result.message);
    }
  }

  return (
    <form action={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">Enter your details below to sign up for an account</p>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error || "An unknown error occurred. Please try again."}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" placeholder="Saif Mohamed" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" required className="border rounded px-3 py-2">
            <option value="">Select a role</option>
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign up"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
