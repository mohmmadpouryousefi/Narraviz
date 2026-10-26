import type { CellValue, ChartPoint, ColumnMeta, ColumnType, DataRow } from "@/types/dataset";
import type { Aggregation, ChartSpec } from "@/types/story";

const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fullFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatNumber(value: number, options: { compact?: boolean } = {}): string {
  if (!Number.isFinite(value)) return "—";
  return options.compact && Math.abs(value) >= 10_000 ? compactFormatter.format(value) : fullFormatter.format(value);
}

export function formatPercent(ratio: number, digits = 1): string {
  if (!Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function formatCell(value: CellValue, type: ColumnType): string {
  if (value === null) return "—";
  if (type === "number" && typeof value === "number") return formatNumber(value);
  if (type === "date" && typeof value === "string") return formatDate(value);
  if (type === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const seconds = Math.round((now.getTime() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (seconds >= size) return rtf.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}

/** Numeric values of one column, skipping nulls and non-numbers. */
export function numericValues(rows: readonly DataRow[], column: string): number[] {
  const out: number[] = [];
  for (const row of rows) {
    const v = row[column];
    if (typeof v === "number" && Number.isFinite(v)) out.push(v);
  }
  return out;
}

function reduce(values: number[], aggregation: Aggregation): number {
  switch (aggregation) {
    case "count":
      return values.length;
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "avg":
      return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
  }
}

export interface AggregateOptions {
  /** Keep at most this many categories (bar charts); the rest are merged into "Other". */
  limit?: number;
}

/**
 * Groups rows by the x column and combines y values. Rows with a null x are skipped.
 * Numeric and date x values are sorted ascending; categories are sorted by y descending.
 */
export function aggregate(
  rows: readonly DataRow[],
  columns: readonly ColumnMeta[],
  spec: Pick<ChartSpec, "xColumn" | "yColumn" | "aggregation">,
  options: AggregateOptions = {},
): ChartPoint[] {
  const xMeta = columns.find((c) => c.name === spec.xColumn);
  if (!xMeta) throw new Error(`Unknown column "${spec.xColumn}"`);
  if (spec.aggregation !== "count") {
    const yMeta = columns.find((c) => c.name === spec.yColumn);
    if (!yMeta) throw new Error(`Unknown column "${spec.yColumn ?? ""}"`);
    if (yMeta.type !== "number") throw new Error(`Column "${yMeta.name}" is not numeric`);
  }

  const groups = new Map<string | number, number[]>();
  for (const row of rows) {
    const x = row[spec.xColumn];
    if (x === null || x === undefined) continue;
    const key = typeof x === "boolean" ? String(x) : x;
    let bucket = groups.get(key);
    if (!bucket) groups.set(key, (bucket = []));
    if (spec.aggregation === "count") {
      bucket.push(1);
    } else {
      const y = row[spec.yColumn as string];
      if (typeof y === "number" && Number.isFinite(y)) bucket.push(y);
    }
  }

  let points: ChartPoint[] = [];
  for (const [x, values] of groups) {
    if (values.length === 0) continue; // every y was null for this x
    points.push({ x, y: reduce(values, spec.aggregation) });
  }

  const ordered = xMeta.type === "number" || xMeta.type === "date";
  if (ordered) {
    points.sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));
  } else {
    points.sort((a, b) => b.y - a.y);
    if (options.limit && points.length > options.limit) {
      const head = points.slice(0, options.limit - 1);
      const rest = points.slice(options.limit - 1);
      const merged =
        spec.aggregation === "avg" || spec.aggregation === "min" || spec.aggregation === "max"
          ? null // merging averages/extremes into "Other" would be misleading, so drop the tail
          : rest.reduce((sum, p) => sum + p.y, 0);
      points = merged === null ? head : [...head, { x: "Other", y: merged }];
    }
  }
  return points;
}

const IDENTIFIER_NAME = /(^|[_\s-])(id|uuid|key|code|zip|postal|postcode|phone|index|row)$|^(id|no|nr|number)$/i;

/**
 * Whether a numeric column holds quantities worth summing or charting. Identifiers such as
 * "id", "customer_id" or "zip" are numeric but meaningless to add up.
 */
export function isMeasure(column: ColumnMeta): boolean {
  return column.type === "number" && !IDENTIFIER_NAME.test(column.name.trim());
}

/**
 * Picks a sensible first chart: a date column with a numeric column becomes a line chart,
 * a low-cardinality category with a numeric column becomes a bar chart.
 */
export function suggestChart(columns: readonly ColumnMeta[]): ChartSpec | null {
  const numeric = columns.filter(isMeasure);
  const date = columns.find((c) => c.type === "date");
  const category = columns
    .filter((c) => c.type === "string" || c.type === "boolean")
    .filter((c) => c.uniqueCount >= 2 && c.uniqueCount <= 50)
    .sort((a, b) => a.uniqueCount - b.uniqueCount)[0];
  const y = numeric[0];

  if (date && y) {
    return { type: "line", xColumn: date.name, yColumn: y.name, aggregation: "sum", title: `${y.name} over time` };
  }
  if (category && y) {
    return { type: "bar", xColumn: category.name, yColumn: y.name, aggregation: "sum", title: `${y.name} by ${category.name}` };
  }
  if (category) {
    return { type: "bar", xColumn: category.name, yColumn: null, aggregation: "count", title: `Rows by ${category.name}` };
  }
  return null;
}

export function formatAxisValue(value: string | number, type: ColumnType): string {
  if (typeof value === "number") return formatNumber(value, { compact: true });
  if (type === "date") return formatDate(value);
  return value.length > 16 ? `${value.slice(0, 15)}…` : value;
}
