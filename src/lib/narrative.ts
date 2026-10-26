import type { Insight } from "@/types/story";

export interface Narrative {
  headline: string;
  summary: string;
  source: "ai" | "stats";
}

/** Plain-language narrative assembled from the computed insights; used when no AI key is set or the AI output fails checks. */
export function statsNarrative(datasetName: string, insights: readonly Insight[]): Narrative {
  const findings = insights.filter((i) => i.kind !== "summary");
  const summaryInsight = insights.find((i) => i.kind === "summary");
  const lead = findings[0];

  const sentences: string[] = [];
  if (summaryInsight) sentences.push(`This story is based on ${datasetName}: ${lowerFirst(summaryInsight.title)}.`);
  if (findings.length === 0) {
    sentences.push("No strong trends, outliers or correlations stood out, so the chart below is the best place to start.");
  } else {
    sentences.push(`The clearest finding: ${lowerFirst(findings[0].title)}.`);
    for (const insight of findings.slice(1, 3)) sentences.push(`${upperFirst(insight.title)}.`);
  }

  return {
    headline: lead ? truncate(upperFirst(lead.title), 120) : `A first look at ${datasetName}`,
    summary: sentences.join(" "),
    source: "stats",
  };
}

const NUMBER_RE = /-?\d[\d,]*(?:\.\d+)?\s*[KMB]?/g;

/** Every number in a text, normalized: "1,234.5" -> 1234.5, "1.5M" -> 1500000. */
export function extractNumbers(text: string): number[] {
  const out: number[] = [];
  for (const match of text.matchAll(NUMBER_RE)) {
    const raw = match[0].replace(/\s/g, "");
    const suffix = raw.slice(-1);
    const multiplier = suffix === "K" ? 1e3 : suffix === "M" ? 1e6 : suffix === "B" ? 1e9 : 1;
    const digits = multiplier === 1 ? raw : raw.slice(0, -1);
    const value = Number(digits.replace(/,/g, "")) * multiplier;
    if (Number.isFinite(value)) out.push(value);
  }
  return out;
}

/**
 * Guards against invented numbers: every number in the AI text must match (allowing for rounding)
 * a number in the insights. Small counts like "two" or "3 regions" are allowed through.
 */
export function unsupportedNumbers(text: string, sources: readonly string[]): number[] {
  const known = sources.flatMap(extractNumbers);
  return extractNumbers(text).filter((n) => {
    if (Number.isInteger(n) && Math.abs(n) <= 10) return false;
    return !known.some((k) => Math.abs(n - k) <= Math.max(0.5, Math.abs(k) * 0.01));
  });
}

export function insightSources(datasetName: string, insights: readonly Insight[]): string[] {
  return [datasetName, ...insights.flatMap((i) => [i.title, i.detail])];
}

function lowerFirst(s: string): string {
  // Keep acronyms and names ("EU accounts for...") as they are.
  return /^[A-Z][a-z]/.test(s) && !/^[A-Z][a-z]+[A-Z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}

function upperFirst(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}
