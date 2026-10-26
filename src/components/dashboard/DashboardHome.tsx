import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Database, FileText, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/stories/StatusBadge";
import { relativeTime } from "@/lib/formatData";
import type { DatasetSummary } from "@/types/dataset";
import type { StorySummary } from "@/types/story";

export interface DashboardHomeProps {
  firstName: string | null;
  counts: { stories: number; published: number; datasets: number };
  recentStories: StorySummary[];
  recentDatasets: DatasetSummary[];
}

export function DashboardHome({ firstName, counts, recentStories, recentDatasets }: DashboardHomeProps) {
  const isNew = counts.datasets === 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="bg-chart-gradient rounded-lg p-6">
        <h1 className="mb-2 text-2xl font-bold">{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</h1>
        <p className="mb-4 text-muted-foreground">
          {isNew
            ? "Start by uploading a CSV. Narraviz reads the columns, finds trends and outliers, and drafts a story you can edit."
            : "Pick up where you left off, or turn another dataset into a story."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-data-primary hover:bg-data-primary/90">
            <Link href="/dashboard/datasets">
              <Upload className="mr-2 h-4 w-4" aria-hidden />
              {isNew ? "Upload your first dataset" : "Upload data"}
            </Link>
          </Button>
          {!isNew && (
            <Button asChild variant="outline">
              <Link href="/dashboard/stories">
                <FileText className="mr-2 h-4 w-4" aria-hidden />
                View stories
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Stories" value={counts.stories} icon={FileText} color="bg-data-primary" href="/dashboard/stories" />
        <StatCard title="Published" value={counts.published} icon={CheckCircle2} color="bg-data-success" href="/dashboard/stories" />
        <StatCard title="Datasets" value={counts.datasets} icon={Database} color="bg-data-secondary" href="/dashboard/datasets" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" aria-hidden />
              Recent stories
            </CardTitle>
            {recentStories.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/stories">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            {recentStories.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No stories yet. Upload a dataset and choose &ldquo;Create story&rdquo;.
              </p>
            ) : (
              recentStories.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/editor?id=${encodeURIComponent(s.id)}`}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-gradient">
                    <BarChart3 className="h-5 w-5 text-data-primary" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{s.title}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <StatusBadge status={s.status} />
                      {s.datasetName} · edited {relativeTime(s.updatedAt)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" aria-hidden />
              Recent datasets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDatasets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing uploaded yet.</p>
            ) : (
              recentDatasets.map((d) => (
                <div key={d.id} className="text-sm">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.rowCount.toLocaleString("en-US")} rows · {d.columnCount} columns · {relativeTime(d.createdAt)}
                  </p>
                </div>
              ))
            )}
            <div className="rounded-md bg-data-primary/5 p-3 text-sm">
              <p className="flex items-center gap-1.5 font-medium text-data-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
                How stories are made
              </p>
              <p className="mt-1 text-muted-foreground">
                Trends, outliers and correlations are computed from your data. The narrative only describes those numbers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{value.toLocaleString("en-US")}</p>
          </div>
          <span className={`${color} rounded-lg p-3`}>
            <Icon className="h-5 w-5 text-white" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
