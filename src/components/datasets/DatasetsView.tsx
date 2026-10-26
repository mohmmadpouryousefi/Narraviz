"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Database, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmButton } from "@/components/common/ConfirmButton";
import { InlineError, LoadingRows, PageHeader } from "@/components/common/PageHeader";
import { useDatasets } from "@/hooks/useDataset";
import { api, errorMessage } from "@/lib/apiClient";
import { relativeTime } from "@/lib/formatData";
import { UploadCard } from "./UploadCard";
import { DatasetPreview } from "./DatasetPreview";

export function DatasetsView() {
  const router = useRouter();
  const { datasets, loading, error, upload, remove } = useDatasets();
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function createStory(datasetId: string) {
    setCreating(datasetId);
    setActionError(null);
    try {
      const story = await api.createStory(datasetId);
      router.push(`/dashboard/editor?id=${encodeURIComponent(story.id)}`);
    } catch (e) {
      setActionError(errorMessage(e));
      setCreating(null);
    }
  }

  async function removeDataset(id: string) {
    setActionError(null);
    try {
      await remove(id);
    } catch (e) {
      setActionError(errorMessage(e));
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Datasets"
        description="Upload a CSV, check that the columns were read correctly, then turn it into a story."
      />

      <UploadCard onUpload={upload} />

      <section className="mt-8 space-y-3" aria-labelledby="datasets-heading">
        <h2 id="datasets-heading" className="text-lg font-semibold">
          Your datasets
        </h2>
        {actionError && <InlineError>{actionError}</InlineError>}
        {error && <InlineError>{error}</InlineError>}
        {loading && <LoadingRows />}
        {datasets?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <Database className="h-6 w-6" aria-hidden />
              No datasets yet. Upload a CSV above to get started.
            </CardContent>
          </Card>
        )}

        {datasets?.map((d) => {
          const expanded = open === d.id;
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : d.id)}
                    aria-expanded={expanded}
                    aria-controls={`preview-${d.id}`}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{d.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {d.rowCount.toLocaleString("en-US")} rows · {d.columnCount} columns · uploaded {relativeTime(d.createdAt)}
                      </span>
                    </span>
                  </button>
                  <Button
                    size="sm"
                    onClick={() => createStory(d.id)}
                    disabled={creating !== null}
                    className="bg-data-primary hover:bg-data-primary/90"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4" aria-hidden />
                    {creating === d.id ? "Generating story…" : "Create story"}
                  </Button>
                  <ConfirmButton
                    label={`Delete ${d.name}`}
                    confirmLabel="Delete dataset and its stories?"
                    icon={<Trash2 className="h-4 w-4" aria-hidden />}
                    onConfirm={() => removeDataset(d.id)}
                  />
                </div>
                {expanded && (
                  <div id={`preview-${d.id}`} className="mt-4">
                    <DatasetPreview id={d.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
