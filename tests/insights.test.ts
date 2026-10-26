import { describe, expect, it } from "vitest";
import { computeInsights, linearTrend, mean, pearson, pickDiverse, quantile, redundantMeasures, standardDeviation } from "@/lib/insights";
import type { Insight } from "@/types/story";
import { parseCsv } from "@/lib/csvParser";

describe("statistics helpers", () => {
  it("computes mean, sample standard deviation and quantiles", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.138, 3);
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(quantile([1, 2, 3, 4, 5], 0.25)).toBe(2);
  });

  it("computes Pearson correlation", () => {
    expect(pearson([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1);
    expect(pearson([1, 2, 3, 4], [8, 6, 4, 2])).toBeCloseTo(-1);
    expect(pearson([1, 1, 1], [1, 2, 3])).toBeNaN(); // no variance
  });

  it("fits a linear trend", () => {
    const { slope, r2 } = linearTrend([10, 20, 30, 40]);
    expect(slope).toBeCloseTo(10);
    expect(r2).toBeCloseTo(1);
  });
});

describe("computeInsights", () => {
  const monthly = parseCsv(
    [
      "month,region,revenue,ad_spend",
      ...Array.from({ length: 12 }, (_, i) => {
        const month = `2024-${String(i + 1).padStart(2, "0")}-01`;
        return [
          `${month},EU,${100 + i * 10},${10 + i}`,
          `${month},US,${50 + i * 5},${5 + i * 0.5}`,
        ].join("\n");
      }),
    ].join("\n"),
  );

  it("finds a rising trend with the real start and end values", () => {
    const trend = computeInsights(monthly.columns, monthly.rows).find((i) => i.kind === "trend" && i.columns.includes("revenue"));
    // Jan: 100 + 50 = 150; Dec: 210 + 105 = 315
    expect(trend?.title).toBe("revenue rose from 150 to 315 (+110.0%) between Jan 1, 2024 and Dec 1, 2024");
    expect(trend?.detail).toMatch(/explains 100% of the variation/);
  });

  it("finds the leading category and its share", () => {
    const top = computeInsights(monthly.columns, monthly.rows).find((i) => i.kind === "top" && i.columns.includes("revenue"));
    // EU = 12*100 + 10*66 = 1860; US = 12*50 + 5*66 = 930; share = 1860 / 2790
    expect(top?.title).toBe("EU accounts for 66.7% of total revenue");
  });

  it("reports derived columns (r ≈ 1) as lockstep and doesn't repeat findings for them", () => {
    // In this data ad_spend is exactly revenue / 10.
    const insights = computeInsights(monthly.columns, monthly.rows);
    const corr = insights.find((i) => i.kind === "correlation");
    expect(corr?.title).toBe("revenue and ad_spend move almost in lockstep");
    expect(corr?.score).toBeLessThan(0.3);
    expect(redundantMeasures(monthly.columns, monthly.rows)).toEqual(new Set(["ad_spend"]));
    expect(insights.filter((i) => i.kind !== "correlation" && i.columns.includes("ad_spend"))).toEqual([]);
  });

  it("finds a real (noisy) correlation and warns about causation", () => {
    const noise = [3, -2, 4, -5, 1, 0, -3, 5, -1, 2, -4, 3];
    const data = parseCsv(
      ["temperature,ice_cream_sales", ...noise.map((n, i) => `${10 + i * 2},${100 + i * 8 + n * 6}`)].join("\n"),
    );
    const corr = computeInsights(data.columns, data.rows).find((i) => i.kind === "correlation");
    expect(corr?.title).toBe("Strong positive correlation between temperature and ice_cream_sales");
    expect(corr?.detail).toMatch(/doesn't show that one causes the other/);
  });

  it("flags outliers with Tukey's fences and names the row", () => {
    const data = parseCsv(
      ["store,sales", ...["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((s, i) => `${s},${100 + i}`), "J,950"].join("\n"),
    );
    const outlier = computeInsights(data.columns, data.rows).find((i) => i.kind === "outlier");
    expect(outlier?.title).toBe("1 unusual sales value");
    expect(outlier?.detail).toMatch(/950 \(store: J\)/);
  });

  it("ranks findings and always ends with a summary, within the limit", () => {
    const insights = computeInsights(monthly.columns, monthly.rows, { limit: 3 });
    expect(insights).toHaveLength(3);
    expect(insights.at(-1)?.kind).toBe("summary");
    expect(new Set(insights.slice(0, 2).map((i) => i.kind)).size).toBe(2);
  });

  it("keeps one kind from crowding out the others", () => {
    const ranked = [
      { kind: "correlation", score: 0.9 },
      { kind: "correlation", score: 0.85 },
      { kind: "correlation", score: 0.8 },
      { kind: "trend", score: 0.6 },
      { kind: "outlier", score: 0.4 },
    ].map((i, n) => ({ ...i, title: String(n), detail: "", columns: [] })) as Insight[];
    expect(pickDiverse(ranked, 3).map((i) => i.kind)).toEqual(["correlation", "trend", "outlier"]);
    // One of each kind first, then the next best.
    expect(pickDiverse(ranked, 4).map((i) => i.score)).toEqual([0.9, 0.6, 0.4, 0.85]);
  });

  it("handles data with nothing interesting", () => {
    const flat = parseCsv("id,name\n1,a\n2,b\n3,c");
    const insights = computeInsights(flat.columns, flat.rows);
    expect(insights.map((i) => i.kind)).toEqual(["summary"]);
    expect(insights[0].title).toBe("3 rows across 2 columns");
  });
});
