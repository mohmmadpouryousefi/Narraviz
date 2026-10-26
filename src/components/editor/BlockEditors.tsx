"use client";

import { ArrowDown, ArrowUp, BarChart3, Lightbulb, LineChart as LineIcon, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChartView } from "@/components/charts/ChartView";
import { isMeasure } from "@/lib/formatData";
import type { Dataset } from "@/types/dataset";
import type { Aggregation, ChartSpec, Insight, StoryBlock } from "@/types/story";

const selectClass =
  "h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-data-primary/40";

export function BlockFrame({
  icon,
  label,
  index,
  total,
  onMove,
  onRemove,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  index: number;
  total: number;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={`${label} block ${index + 1}`} className={`group rounded-lg border bg-card p-4 ${error ? "border-destructive" : ""}`}>
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
        <div className="ml-auto flex gap-1 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button type="button" size="sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" aria-label="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" aria-label="Remove block" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {children}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </section>
  );
}

export function TextBlockEditor({ content, onChange }: { content: string; onChange: (content: string) => void }) {
  return (
    <Textarea
      value={content}
      maxLength={5000}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Text"
      className="min-h-28 resize-y text-base leading-relaxed"
      placeholder="Write what this part of the story should say…"
    />
  );
}

export function ChartBlockEditor({
  chart,
  caption,
  dataset,
  onChange,
}: {
  chart: ChartSpec;
  caption: string;
  dataset: Dataset;
  onChange: (next: { chart: ChartSpec; caption: string }) => void;
}) {
  const measures = dataset.columns.filter(isMeasure);
  const set = (patch: Partial<ChartSpec>) => onChange({ chart: { ...chart, ...patch }, caption });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center gap-1.5 text-sm">
          Type
          <select className={selectClass} value={chart.type} onChange={(e) => set({ type: e.target.value as ChartSpec["type"] })}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          X
          <select className={selectClass} value={chart.xColumn} onChange={(e) => set({ xColumn: e.target.value })}>
            {dataset.columns.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          Value
          <select
            className={selectClass}
            value={chart.aggregation}
            onChange={(e) => {
              const aggregation = e.target.value as Aggregation;
              set({ aggregation, yColumn: aggregation === "count" ? null : (chart.yColumn ?? measures[0]?.name ?? null) });
            }}
          >
            <option value="count">Count of rows</option>
            {measures.length > 0 && (
              <>
                <option value="sum">Sum of</option>
                <option value="avg">Average of</option>
                <option value="min">Minimum of</option>
                <option value="max">Maximum of</option>
              </>
            )}
          </select>
        </label>
        {chart.aggregation !== "count" && (
          <select
            aria-label="Value column"
            className={selectClass}
            value={chart.yColumn ?? ""}
            onChange={(e) => set({ yColumn: e.target.value })}
          >
            {measures.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <Input
        value={chart.title}
        maxLength={200}
        onChange={(e) => set({ title: e.target.value })}
        aria-label="Chart title"
        placeholder="Chart title"
        className="font-medium"
      />
      <ChartView spec={chart} dataset={dataset} />
      <Textarea
        value={caption}
        maxLength={1000}
        rows={1}
        onChange={(e) => onChange({ chart, caption: e.target.value })}
        aria-label="Caption"
        placeholder="Caption (optional)"
        className="field-sizing-content min-h-9 resize-none text-sm text-muted-foreground"
      />
    </div>
  );
}

const KIND_LABEL: Record<Insight["kind"], string> = {
  summary: "Overview",
  trend: "Trend",
  outlier: "Outlier",
  correlation: "Correlation",
  top: "Top group",
};

export function InsightBlockView({ insight }: { insight: Insight }) {
  return (
    <div className="rounded-md bg-data-primary/5 p-3">
      <p className="text-xs font-medium text-data-primary">{KIND_LABEL[insight.kind]}</p>
      <p className="mt-1 font-medium first-letter:uppercase">{insight.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{insight.detail}</p>
    </div>
  );
}

export function blockMeta(block: StoryBlock): { label: string; icon: React.ReactNode } {
  switch (block.type) {
    case "text":
      return { label: "Text", icon: <Type className="h-3.5 w-3.5" aria-hidden /> };
    case "chart":
      return {
        label: block.chart.type === "line" ? "Line chart" : "Bar chart",
        icon: block.chart.type === "line" ? <LineIcon className="h-3.5 w-3.5" aria-hidden /> : <BarChart3 className="h-3.5 w-3.5" aria-hidden />,
      };
    case "insight":
      return { label: "Insight", icon: <Lightbulb className="h-3.5 w-3.5" aria-hidden /> };
  }
}
