"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logIn, type AuthFormState } from "@/app/auth/actions";
import { FormField } from "./FormField";

interface LoginFormProps {
  callbackUrl: string;
  /** Rendered server-side so the GitHub button can use a server action. */
  socialLogin?: React.ReactNode;
  initialError?: string;
}

export function LoginForm({ callbackUrl, socialLogin, initialError }: LoginFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(logIn, {});
  const error = state.error ?? (state.fieldErrors ? undefined : initialError);

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-data-primary to-data-secondary bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to continue your data storytelling journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {socialLogin}

          <form action={action} className="space-y-4" noValidate>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <FormField
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              icon={Mail}
              defaultValue={state.values?.email}
              error={state.fieldErrors?.email}
            />
            <FormField
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              icon={Lock}
              error={state.fieldErrors?.password}
            />
            <Button type="submit" className="w-full h-11 bg-data-primary hover:bg-data-primary/90" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
              {!pending && <ArrowRight className="ml-2 h-4 w-4" aria-hidden />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          No account yet?&nbsp;
          <Link href="/auth/signup" className="font-medium text-data-primary hover:underline">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
