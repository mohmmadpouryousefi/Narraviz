"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmButton } from "@/components/common/ConfirmButton";
import { InlineError, LoadingRows, PageHeader } from "@/components/common/PageHeader";
import { useStories } from "@/hooks/useStory";
import { errorMessage } from "@/lib/apiClient";
import { relativeTime } from "@/lib/formatData";
import { StatusBadge } from "./StatusBadge";

export function StoriesView() {
  const { stories, loading, error, remove } = useStories();
  const [actionError, setActionError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Stories"
        description="Each story pairs charts with the insights behind them and a narrative you can edit."
        action={
          <Button asChild className="bg-data-primary hover:bg-data-primary/90">
            <Link href="/dashboard/datasets">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              New story
            </Link>
          </Button>
        }
      />

      <div className="space-y-3">
        {(error || actionError) && <InlineError>{error ?? actionError}</InlineError>}
        {loading && <LoadingRows />}
        {stories?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
              <FileText className="h-6 w-6" aria-hidden />
              No stories yet. Pick a dataset and choose &ldquo;Create story&rdquo;.
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/datasets">Go to datasets</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {stories?.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <Link href={`/dashboard/editor?id=${encodeURIComponent(s.id)}`} className="min-w-0 flex-1 group">
                <span className="block truncate font-medium group-hover:underline">{s.title}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <StatusBadge status={s.status} />
                  <Badge variant="outline" className="font-normal">
                    {s.datasetName}
                  </Badge>
                  edited {relativeTime(s.updatedAt)}
                </span>
              </Link>
              <Button asChild size="sm" variant="ghost" aria-label={`Edit ${s.title}`}>
                <Link href={`/dashboard/editor?id=${encodeURIComponent(s.id)}`}>
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <ConfirmButton
                label={`Delete ${s.title}`}
                confirmLabel="Delete story?"
                icon={<Trash2 className="h-4 w-4" aria-hidden />}
                onConfirm={async () => {
                  setActionError(null);
                  try {
                    await remove(s.id);
                  } catch (e) {
                    setActionError(errorMessage(e));
                  }
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
