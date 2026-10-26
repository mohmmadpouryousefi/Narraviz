import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// UX guard only: the API routes check the session themselves, so data stays protected either way.
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard");
  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}
