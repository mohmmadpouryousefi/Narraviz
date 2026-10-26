import { redirect } from "next/navigation";
import { auth, githubEnabled } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { safeCallbackUrl } from "@/lib/validation";

export const metadata = { title: "Sign in · Narraviz" };

// Auth.js redirects here with ?error=<type> when an OAuth sign-in fails.
function describeAuthError(type: string | undefined): string | undefined {
  if (!type) return undefined;
  if (type === "OAuthAccountNotLinked") {
    return "This email already has an account. Sign in with your password instead.";
  }
  return "Sign-in failed. Please try again.";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl: rawCallback, error } = await searchParams;
  const callbackUrl = safeCallbackUrl(rawCallback);
  if ((await auth())?.user) redirect(callbackUrl);

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      initialError={describeAuthError(error)}
      socialLogin={<SocialLogin mode="login" githubEnabled={githubEnabled} callbackUrl={callbackUrl} />}
    />
  );
}
