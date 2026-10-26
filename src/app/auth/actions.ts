"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { fieldErrors, safeCallbackUrl, signInSchema, signUpSchema } from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";

export interface AuthFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back so the form keeps what the user typed after an error (never the password). */
  values?: { name?: string; email?: string };
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = { email: text(formData, "email"), password: text(formData, "password") };
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values: { email: input.email } };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });
  } catch (error) {
    // signIn throws a redirect on success; only Auth.js errors are handled here.
    if (error instanceof AuthError) {
      return {
        error: error.type === "CredentialsSignin" ? "Invalid email or password." : "Sign-in failed. Please try again.",
        values: { email: input.email },
      };
    }
    throw error;
  }
  return {};
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = { name: text(formData, "name"), email: text(formData, "email"), password: text(formData, "password") };
  const parsed = signUpSchema.safeParse(input);
  const values = { name: input.name, email: input.email };
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  const { name, email, password } = parsed.data;
  try {
    await db.user.create({ data: { name, email, passwordHash: await hashPassword(password) } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { email: "An account with this email already exists. Sign in instead." }, values };
    }
    throw error;
  }

  // Sign the new user in; this throws the redirect to the dashboard.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function logInWithGitHub(formData: FormData): Promise<void> {
  await signIn("github", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function logOut(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
