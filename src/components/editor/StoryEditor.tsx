"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Bot, Calculator, Check, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineError, LoadingRows } from "@/components/common/PageHeader";
import { useDataset } from "@/hooks/useDataset";
import { useStory } from "@/hooks/useStory";
import { suggestChart } from "@/lib/formatData";
import { newBlockId } from "@/lib/storyBlocks";
import type { ChartSpec, StoryBlock } from "@/types/story";
import { BlockFrame, ChartBlockEditor, InsightBlockView, TextBlockEditor, blockMeta } from "./BlockEditors";

export function StoryEditor({ id }: { id: string }) {
  const { story, loadError, saveError, saving, savedAt, dirty, update, save } = useStory(id);
  const { dataset, error: datasetError } = useDataset(story?.datasetId ?? null);

  // Ctrl/Cmd+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  });

  if (loadError) return <InlineError>{loadError}</InlineError>;
  if (!story) return <LoadingRows count={4} />;

  const blocks = story.blocks;
  const setBlocks = (next: StoryBlock[]) => update("blocks", next);
  const replace = (index: number, block: StoryBlock) => setBlocks(blocks.map((b, i) => (i === index ? block : b)));
  const move = (index: number, delta: -1 | 1) => {
    const next = [...blocks];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setBlocks(next);
  };
  const remove = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));

  function addChart() {
    if (!dataset) return;
    const chart: ChartSpec =
      suggestChart(dataset.columns) ??
      ({ type: "bar", xColumn: dataset.columns[0].name, yColumn: null, aggregation: "count", title: "" } satisfies ChartSpec);
    setBlocks([...blocks, { id: newBlockId(), type: "chart", chart, caption: "" }]);
  }

  const blockError = (index: number) =>
    Object.entries(saveError?.fields ?? {})
      .filter(([key]) => key.startsWith(`blocks.${index}.`))
      .map(([, message]) => message)
      .join(" ") || undefined;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/stories">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden />
            Stories
          </Link>
        </Button>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {story.narrativeSource === "ai" ? (
            <>
              <Bot className="h-3.5 w-3.5" aria-hidden /> Narrative drafted by Claude from computed insights
            </>
          ) : story.narrativeSource === "stats" ? (
            <>
              <Calculator className="h-3.5 w-3.5" aria-hidden /> Narrative generated from statistics
            </>
          ) : null}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm">
            Status
            <select
              value={story.status}
              onChange={(e) => update("status", e.target.value as typeof story.status)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {saving ? "Saving…" : dirty ? "Unsaved changes" : savedAt ? (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" aria-hidden /> Saved
              </span>
            ) : null}
          </span>
          <Button onClick={() => void save()} disabled={!dirty || saving} className="bg-data-primary hover:bg-data-primary/90">
            Save
          </Button>
        </div>
      </div>

      {saveError && (
        <div className="mb-4">
          <InlineError>{saveError.message}</InlineError>
        </div>
      )}

      <div className="mb-6 space-y-2">
        {/* A textarea that grows with its content, so long titles wrap instead of being cut off. */}
        <textarea
          value={story.title}
          maxLength={200}
          rows={1}
          onChange={(e) => update("title", e.target.value.replace(/\n/g, " "))}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          aria-label="Story title"
          aria-invalid={saveError?.fields.title ? true : undefined}
          className="field-sizing-content w-full resize-none border-0 bg-transparent p-0 text-2xl font-bold leading-tight outline-none md:text-3xl"
        />
        {saveError?.fields.title && <p className="text-sm text-destructive">{saveError.fields.title}</p>}
        <Input
          value={story.description}
          maxLength={1000}
          onChange={(e) => update("description", e.target.value)}
          aria-label="Story description"
          placeholder="Short description"
          className="border-0 px-0 text-muted-foreground shadow-none focus-visible:ring-0"
        />
        <p className="text-xs text-muted-foreground">
          Dataset: {dataset ? dataset.name : story.datasetName}
          {dataset && ` · ${dataset.rowCount.toLocaleString("en-US")} rows`}
        </p>
      </div>

      {datasetError && <InlineError>Couldn&apos;t load the dataset: {datasetError}</InlineError>}

      <div className="space-y-4">
        {blocks.map((block, index) => {
          const meta = blockMeta(block);
          return (
            <BlockFrame
              key={block.id}
              icon={meta.icon}
              label={meta.label}
              index={index}
              total={blocks.length}
              onMove={(delta) => move(index, delta)}
              onRemove={() => remove(index)}
              error={blockError(index)}
            >
              {block.type === "text" && (
                <TextBlockEditor content={block.content} onChange={(content) => replace(index, { ...block, content })} />
              )}
              {block.type === "chart" &&
                (dataset ? (
                  <ChartBlockEditor
                    chart={block.chart}
                    caption={block.caption}
                    dataset={dataset}
                    onChange={({ chart, caption }) => replace(index, { ...block, chart, caption })}
                  />
                ) : (
                  <div className="h-80 animate-pulse rounded-md bg-muted" aria-busy="true" />
                ))}
              {block.type === "insight" && <InsightBlockView insight={block.insight} />}
            </BlockFrame>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={blocks.length >= 50}
          onClick={() => setBlocks([...blocks, { id: newBlockId(), type: "text", content: "" }])}
        >
          <Plus className="mr-1 h-4 w-4" aria-hidden />
          <Type className="mr-1.5 h-4 w-4" aria-hidden />
          Text
        </Button>
        <Button type="button" variant="outline" disabled={!dataset || blocks.length >= 50} onClick={addChart}>
          <Plus className="mr-1 h-4 w-4" aria-hidden />
          <BarChart3 className="mr-1.5 h-4 w-4" aria-hidden />
          Chart
        </Button>
      </div>
    </div>
  );
}
