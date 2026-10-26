import "server-only";
import type { ColumnMeta, DataRow } from "@/types/dataset";
import type { ChartSpec, StoryBlock } from "@/types/story";
import { computeInsights } from "@/lib/insights";
import { generateNarrative } from "@/lib/aiNarrative";
import { suggestChart } from "@/lib/formatData";
import { newBlockId } from "@/lib/storyBlocks";

export interface GeneratedStory {
  title: string;
  description: string;
  blocks: StoryBlock[];
  narrativeSource: "ai" | "stats";
}

/** A second chart that complements the first: a category breakdown when the first is a time series. */
function secondaryChart(columns: readonly ColumnMeta[], primary: ChartSpec | null): ChartSpec | null {
  if (!primary || primary.type !== "line") return null;
  const withoutDates = columns.filter((c) => c.type !== "date");
  const bar = suggestChart(withoutDates);
  return bar && bar.type === "bar" ? bar : null;
}

export async function generateStory(
  datasetName: string,
  columns: readonly ColumnMeta[],
  rows: readonly DataRow[],
): Promise<GeneratedStory> {
  const insights = computeInsights(columns, rows);
  const narrative = await generateNarrative(datasetName, insights);
  const primary = suggestChart(columns);
  const secondary = secondaryChart(columns, primary);
  const findings = insights.filter((i) => i.kind !== "summary");

  const blocks: StoryBlock[] = [{ id: newBlockId(), type: "text", content: narrative.summary }];
  if (primary) {
    // Caption the chart with the finding it shows, if there is one.
    const about = findings.find((i) => i.columns.includes(primary.xColumn) && (!primary.yColumn || i.columns.includes(primary.yColumn)));
    blocks.push({ id: newBlockId(), type: "chart", chart: primary, caption: about?.detail ?? "" });
  }
  for (const insight of findings.slice(0, 3)) blocks.push({ id: newBlockId(), type: "insight", insight });
  if (secondary) {
    const about = findings.find((i) => i.kind === "top" && i.columns.includes(secondary.xColumn));
    blocks.push({ id: newBlockId(), type: "chart", chart: secondary, caption: about?.title ?? "" });
  }

  return {
    title: narrative.headline,
    description: `Generated from ${datasetName}`,
    blocks,
    narrativeSource: narrative.source,
  };
}
