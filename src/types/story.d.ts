export type ChartType = "bar" | "line";

/** How rows sharing the same x value are combined into one y value. */
export type Aggregation = "sum" | "avg" | "count" | "min" | "max";

export interface ChartSpec {
  type: ChartType;
  xColumn: string;
  /** Ignored when aggregation is "count". */
  yColumn: string | null;
  aggregation: Aggregation;
  title: string;
}

export type InsightKind = "summary" | "trend" | "outlier" | "correlation" | "top";

/** A fact computed from the data. The narrative layer may only describe insights, never invent numbers. */
export interface Insight {
  kind: InsightKind;
  title: string;
  detail: string;
  columns: string[];
  /** 0..1, higher is more noteworthy. Used to rank insights. */
  score: number;
}

export type StoryBlock =
  | { id: string; type: "text"; content: string }
  | { id: string; type: "chart"; chart: ChartSpec; caption: string }
  | { id: string; type: "insight"; insight: Insight };

export type StoryStatus = "draft" | "published";

export interface StorySummary {
  id: string;
  title: string;
  description: string;
  status: StoryStatus;
  datasetId: string;
  datasetName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story extends StorySummary {
  blocks: StoryBlock[];
  /** "ai" when Claude wrote the narrative, "stats" when the deterministic fallback did. */
  narrativeSource: "ai" | "stats" | null;
}
