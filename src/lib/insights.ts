import type { ColumnMeta, DataRow } from "@/types/dataset";
import type { Insight } from "@/types/story";
import { aggregate, formatDate, formatNumber, formatPercent, isMeasure, numericValues } from "@/lib/formatData";

/**
 * Deterministic insights computed from the data. Every number a story shows comes from here;
 * the AI narrative may only rephrase these, never compute its own.
 */

export function mean(values: readonly number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : Number.NaN;
}

export function standardDeviation(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1));
}

export function quantile(sorted: readonly number[], q: number): number {
  if (sorted.length === 0) return Number.NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Pearson correlation over rows where both values are present. */
export function pearson(xs: readonly number[], ys: readonly number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return Number.NaN;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return dx === 0 || dy === 0 ? Number.NaN : num / Math.sqrt(dx * dy);
}

/** Least-squares fit of values against their index; r2 says how well a straight line explains them. */
export function linearTrend(values: readonly number[]): { slope: number; r2: number } {
  const xs = values.map((_, i) => i);
  const r = pearson(xs, values);
  const sx = standardDeviation(xs);
  const sy = standardDeviation(values);
  if (!Number.isFinite(r) || sx === 0) return { slope: 0, r2: 0 };
  return { slope: (r * sy) / sx, r2: r * r };
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function summaryInsight(columns: readonly ColumnMeta[], rowCount: number): Insight {
  const counts = (["number", "date", "string", "boolean"] as const)
    .map((t) => [t, columns.filter((c) => c.type === t).length] as const)
    .filter(([, n]) => n > 0)
    .map(([t, n]) => `${n} ${t === "string" ? "text" : t}`);
  const missing = columns.filter((c) => c.nullCount > 0);
  const missingText = missing.length
    ? ` ${missing.length} column(s) have missing values, most in "${[...missing].sort((a, b) => b.nullCount - a.nullCount)[0].name}".`
    : " No values are missing.";
  return {
    kind: "summary",
    title: `${formatNumber(rowCount)} rows across ${columns.length} columns`,
    detail: `The dataset has ${counts.join(", ")} column(s).${missingText}`,
    columns: [],
    score: 0.2,
  };
}

function trendInsights(columns: readonly ColumnMeta[], rows: readonly DataRow[]): Insight[] {
  const date = columns.find((c) => c.type === "date");
  if (!date) return [];
  const out: Insight[] = [];
  for (const y of columns.filter(isMeasure)) {
    const series = aggregate(rows, columns, { xColumn: date.name, yColumn: y.name, aggregation: "sum" });
    if (series.length < 3) continue;
    const values = series.map((p) => p.y);
    const { slope, r2 } = linearTrend(values);
    const first = values[0];
    const last = values[values.length - 1];
    const from = formatDate(String(series[0].x));
    const to = formatDate(String(series[series.length - 1].x));
    const change = first !== 0 ? (last - first) / Math.abs(first) : Number.NaN;
    const direction = slope > 0 ? "rose" : slope < 0 ? "fell" : "stayed flat";
    const changeText = Number.isFinite(change)
      ? ` from ${formatNumber(first)} to ${formatNumber(last)} (${change >= 0 ? "+" : ""}${formatPercent(change)})`
      : ` from ${formatNumber(first)} to ${formatNumber(last)}`;
    const peak = series.reduce((best, p) => (p.y > best.y ? p : best));
    out.push({
      kind: "trend",
      title: `${y.name} ${direction}${changeText} between ${from} and ${to}`,
      detail:
        `Summed per ${date.name}, ${y.name} peaked at ${formatNumber(peak.y)} on ${formatDate(String(peak.x))}. ` +
        (r2 >= 0.5
          ? `The change is steady: a straight line explains ${formatPercent(r2, 0)} of the variation.`
          : `The movement is uneven: a straight line explains only ${formatPercent(r2, 0)} of the variation.`),
      columns: [date.name, y.name],
      // Steady, large moves rank highest.
      score: clamp01(0.4 + 0.4 * r2 + 0.2 * Math.min(1, Math.abs(Number.isFinite(change) ? change : 0))),
    });
  }
  return out;
}

/** Category shares: e.g. "EU accounts for 58% of revenue". */
function topCategoryInsights(columns: readonly ColumnMeta[], rows: readonly DataRow[]): Insight[] {
  const category = columns
    .filter((c) => (c.type === "string" || c.type === "boolean") && c.uniqueCount >= 2 && c.uniqueCount <= 50)
    .sort((a, b) => a.uniqueCount - b.uniqueCount)[0];
  if (!category) return [];
  const out: Insight[] = [];
  for (const y of columns.filter(isMeasure)) {
    const points = aggregate(rows, columns, { xColumn: category.name, yColumn: y.name, aggregation: "sum" });
    const total = points.reduce((s, p) => s + p.y, 0);
    if (points.length < 2 || total <= 0 || points.some((p) => p.y < 0)) continue;
    const [top, second] = points;
    const share = top.y / total;
    const even = 1 / points.length;
    out.push({
      kind: "top",
      title: `${top.x} accounts for ${formatPercent(share)} of total ${y.name}`,
      detail:
        `${top.x} leads with ${formatNumber(top.y)} of ${formatNumber(total)}, ahead of ${second.x} at ${formatNumber(second.y)}` +
        ` (${formatPercent(second.y / total)}). With ${points.length} groups, an even split would be ${formatPercent(even)} each.`,
      columns: [category.name, y.name],
      // How far the leader is above an even split.
      score: clamp01(0.3 + (share - even) * 1.2),
    });
  }
  return out;
}

/** Values more than 1.5 IQR outside the quartiles (Tukey's fences). */
function outlierInsights(columns: readonly ColumnMeta[], rows: readonly DataRow[]): Insight[] {
  const label = columns.find((c) => c.type === "string" && c.uniqueCount > 1) ?? columns.find((c) => c.type === "date");
  const out: Insight[] = [];
  for (const col of columns.filter(isMeasure)) {
    const values = numericValues(rows, col.name);
    if (values.length < 8) continue;
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    if (iqr === 0) continue;
    const low = q1 - 1.5 * iqr;
    const high = q3 + 1.5 * iqr;
    const outliers = rows.filter((r) => {
      const v = r[col.name];
      return typeof v === "number" && (v < low || v > high);
    });
    if (outliers.length === 0) continue;
    const median = quantile(sorted, 0.5);
    const extreme = outliers.reduce((a, b) =>
      Math.abs((b[col.name] as number) - median) > Math.abs((a[col.name] as number) - median) ? b : a,
    );
    const value = extreme[col.name] as number;
    const where = label && extreme[label.name] !== null ? ` (${label.name}: ${label.type === "date" ? formatDate(String(extreme[label.name])) : extreme[label.name]})` : "";
    out.push({
      kind: "outlier",
      title: `${outliers.length} unusual ${col.name} value${outliers.length > 1 ? "s" : ""}`,
      detail:
        `The most extreme is ${formatNumber(value)}${where}; the typical range is ${formatNumber(q1)} to ${formatNumber(q3)}` +
        ` with a median of ${formatNumber(median)}. Check whether ${outliers.length > 1 ? "these are" : "this is"} real or a data-entry error.`,
      columns: label ? [col.name, label.name] : [col.name],
      score: clamp01(0.35 + Math.min(0.4, outliers.length / values.length)),
    });
  }
  return out;
}

function correlationInsights(columns: readonly ColumnMeta[], rows: readonly DataRow[]): Insight[] {
  const numeric = columns.filter(isMeasure);
  const out: Insight[] = [];
  for (let i = 0; i < numeric.length; i++) {
    for (let j = i + 1; j < numeric.length; j++) {
      const a = numeric[i].name;
      const b = numeric[j].name;
      const xs: number[] = [];
      const ys: number[] = [];
      for (const row of rows) {
        const x = row[a];
        const y = row[b];
        if (typeof x === "number" && typeof y === "number") {
          xs.push(x);
          ys.push(y);
        }
      }
      if (xs.length < 10) continue;
      const r = pearson(xs, ys);
      if (!Number.isFinite(r) || Math.abs(r) < 0.5) continue;
      // Near-perfect correlation usually means one column is calculated from the other (e.g. tax from price):
      // true, but rarely the story, so it is reported plainly and ranked low.
      if (Math.abs(r) >= 0.98) {
        out.push({
          kind: "correlation",
          title: `${a} and ${b} move almost in lockstep`,
          detail: `Across ${formatNumber(xs.length)} rows, r = ${r.toFixed(2)}. This usually means one is calculated from the other, so they tell the same story.`,
          columns: [a, b],
          score: 0.25,
        });
        continue;
      }
      const strength = Math.abs(r) >= 0.8 ? "strong" : "moderate";
      out.push({
        kind: "correlation",
        title: `${strength[0].toUpperCase()}${strength.slice(1)} ${r > 0 ? "positive" : "negative"} correlation between ${a} and ${b}`,
        detail:
          `Across ${formatNumber(xs.length)} rows, r = ${r.toFixed(2)}: when ${a} is higher, ${b} tends to be ${r > 0 ? "higher" : "lower"}.` +
          " Correlation alone doesn't show that one causes the other.",
        columns: [a, b],
        score: clamp01(Math.abs(r) * 0.85),
      });
    }
  }
  return out;
}

export function computeInsights(
  columns: readonly ColumnMeta[],
  rows: readonly DataRow[],
  options: { limit?: number } = {},
): Insight[] {
  // A column that only mirrors an earlier one (e.g. tax next to price) would repeat every finding,
  // so trends, shares and outliers are computed for the original column only.
  const redundant = redundantMeasures(columns, rows);
  const primary = columns.filter((c) => !redundant.has(c.name));
  const ranked = [
    ...trendInsights(primary, rows),
    ...topCategoryInsights(primary, rows),
    ...correlationInsights(columns, rows),
    ...outlierInsights(primary, rows),
  ].sort((a, b) => b.score - a.score);
  // The summary always comes last so it never pushes out a finding.
  return [...pickDiverse(ranked, (options.limit ?? 6) - 1), summaryInsight(columns, rows.length)];
}

/** Measures that move in lockstep (|r| >= 0.98) with an earlier measure in the file. */
export function redundantMeasures(columns: readonly ColumnMeta[], rows: readonly DataRow[]): Set<string> {
  const measures = columns.filter(isMeasure);
  const redundant = new Set<string>();
  for (let j = 1; j < measures.length; j++) {
    for (let i = 0; i < j; i++) {
      if (redundant.has(measures[i].name)) continue;
      const xs: number[] = [];
      const ys: number[] = [];
      for (const row of rows) {
        const x = row[measures[i].name];
        const y = row[measures[j].name];
        if (typeof x === "number" && typeof y === "number") {
          xs.push(x);
          ys.push(y);
        }
      }
      if (xs.length >= 10 && Math.abs(pearson(xs, ys)) >= 0.98) {
        redundant.add(measures[j].name);
        break;
      }
    }
  }
  return redundant;
}

/**
 * Orders insights so the best of each kind comes first (by score), followed by the rest,
 * so one kind (e.g. five correlations) can't crowd out a trend or an outlier.
 */
export function pickDiverse(ranked: readonly Insight[], limit: number): Insight[] {
  const picked: Insight[] = [];
  const kinds = new Set<string>();
  for (const insight of ranked) {
    if (picked.length < limit && !kinds.has(insight.kind)) {
      picked.push(insight);
      kinds.add(insight.kind);
    }
  }
  for (const insight of ranked) {
    if (picked.length < limit && !picked.includes(insight)) picked.push(insight);
  }
  return picked;
}
