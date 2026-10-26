import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { datasetSummarySelect, storySummarySelect, toDatasetSummary, toStorySummary } from "@/lib/api";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

export const metadata = { title: "Dashboard · Narraviz" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/login?callbackUrl=/dashboard");

  // Queried directly on the server: no client round trip, and always scoped to this user.
  const [stories, published, datasets, recentStories, recentDatasets] = await Promise.all([
    db.story.count({ where: { userId } }),
    db.story.count({ where: { userId, status: "published" } }),
    db.dataset.count({ where: { userId } }),
    db.story.findMany({ where: { userId }, select: storySummarySelect, orderBy: { updatedAt: "desc" }, take: 5 }),
    db.dataset.findMany({ where: { userId }, select: datasetSummarySelect, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  return (
    <DashboardHome
      firstName={session.user?.name?.trim().split(/\s+/)[0] ?? null}
      counts={{ stories, published, datasets }}
      recentStories={recentStories.map(toStorySummary)}
      recentDatasets={recentDatasets.map(toDatasetSummary)}
    />
  );
}
