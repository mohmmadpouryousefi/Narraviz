"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp, type AuthFormState } from "@/app/auth/actions";
import { FormField } from "./FormField";

export function SignupForm({ socialLogin }: { socialLogin?: React.ReactNode }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signUp, {});

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-data-primary to-data-secondary bg-clip-text text-transparent">
            Create your account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Upload a CSV and turn it into a story in minutes
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {socialLogin}

          <form action={action} className="space-y-4" noValidate>
            {state.error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <FormField
              name="name"
              label="Name"
              autoComplete="name"
              icon={User}
              defaultValue={state.values?.name}
              error={state.fieldErrors?.name}
            />
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
              autoComplete="new-password"
              icon={Lock}
              hint="At least 8 characters."
              error={state.fieldErrors?.password}
            />
            <Button type="submit" className="w-full h-11 bg-data-primary hover:bg-data-primary/90" disabled={pending}>
              {pending ? "Creating account…" : "Create account"}
              {!pending && <ArrowRight className="ml-2 h-4 w-4" aria-hidden />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?&nbsp;
          <Link href="/auth/login" className="font-medium text-data-primary hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
