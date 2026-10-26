import { redirect } from "next/navigation";
import { auth, githubEnabled } from "@/auth";
import { SignupForm } from "@/components/auth/SignupForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

export const metadata = { title: "Create an account · Narraviz" };

export default async function SignupPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return <SignupForm socialLogin={<SocialLogin mode="signup" githubEnabled={githubEnabled} />} />;
}
