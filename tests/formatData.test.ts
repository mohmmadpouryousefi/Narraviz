import { describe, expect, it } from "vitest";
import {
  aggregate,
  formatCell,
  formatNumber,
  formatPercent,
  numericValues,
  relativeTime,
  suggestChart,
} from "@/lib/formatData";
import type { ColumnMeta, DataRow } from "@/types/dataset";

const columns: ColumnMeta[] = [
  { name: "date", type: "date", nullCount: 0, uniqueCount: 3 },
  { name: "region", type: "string", nullCount: 1, uniqueCount: 3 },
  { name: "revenue", type: "number", nullCount: 1, uniqueCount: 4 },
];

const rows: DataRow[] = [
  { date: "2024-01-02", region: "EU", revenue: 100 },
  { date: "2024-01-01", region: "US", revenue: 300 },
  { date: "2024-01-02", region: "EU", revenue: 50 },
  { date: "2024-01-03", region: "APAC", revenue: null },
  { date: "2024-01-03", region: null, revenue: 10 },
];

describe("formatting", () => {
  it("formats numbers, compacting only large values", () => {
    expect(formatNumber(1234.567)).toBe("1,234.57");
    expect(formatNumber(1500)).toBe("1,500");
    expect(formatNumber(1_500_000, { compact: true })).toBe("1.5M");
    expect(formatNumber(Number.NaN)).toBe("—");
  });

  it("formats percentages", () => {
    expect(formatPercent(0.1234)).toBe("12.3%");
  });

  it("formats cells by column type", () => {
    expect(formatCell(null, "number")).toBe("—");
    expect(formatCell(true, "boolean")).toBe("Yes");
    expect(formatCell("2024-03-05", "date")).toBe("Mar 5, 2024");
  });

  it("formats relative time", () => {
    const now = new Date("2024-01-10T12:00:00Z");
    expect(relativeTime("2024-01-10T11:59:30Z", now)).toBe("just now");
    expect(relativeTime("2024-01-10T10:00:00Z", now)).toBe("2 hours ago");
    expect(relativeTime("2024-01-09T12:00:00Z", now)).toBe("yesterday");
  });
});

describe("numericValues", () => {
  it("skips nulls", () => {
    expect(numericValues(rows, "revenue")).toEqual([100, 300, 50, 10]);
  });
});

describe("aggregate", () => {
  it("sums by date and sorts ascending", () => {
    expect(aggregate(rows, columns, { xColumn: "date", yColumn: "revenue", aggregation: "sum" })).toEqual([
      { x: "2024-01-01", y: 300 },
      { x: "2024-01-02", y: 150 },
      { x: "2024-01-03", y: 10 },
    ]);
  });

  it("sorts categories by value, skips null x, and drops groups with no y values", () => {
    expect(aggregate(rows, columns, { xColumn: "region", yColumn: "revenue", aggregation: "sum" })).toEqual([
      { x: "US", y: 300 },
      { x: "EU", y: 150 },
    ]);
  });

  it("averages and counts", () => {
    expect(aggregate(rows, columns, { xColumn: "region", yColumn: "revenue", aggregation: "avg" })).toContainEqual({
      x: "EU",
      y: 75,
    });
    expect(aggregate(rows, columns, { xColumn: "region", yColumn: null, aggregation: "count" })).toEqual([
      { x: "EU", y: 2 },
      { x: "US", y: 1 },
      { x: "APAC", y: 1 },
    ]);
  });

  it("merges the long tail into Other for sums", () => {
    const many: DataRow[] = ["a", "b", "c", "d"].map((region, i) => ({ region, revenue: 10 - i }));
    expect(aggregate(many, columns, { xColumn: "region", yColumn: "revenue", aggregation: "sum" }, { limit: 3 })).toEqual([
      { x: "a", y: 10 },
      { x: "b", y: 9 },
      { x: "Other", y: 15 },
    ]);
  });

  it("drops the tail instead of merging averages", () => {
    const many: DataRow[] = ["a", "b", "c", "d"].map((region, i) => ({ region, revenue: 10 - i }));
    const points = aggregate(many, columns, { xColumn: "region", yColumn: "revenue", aggregation: "avg" }, { limit: 3 });
    expect(points.map((p) => p.x)).toEqual(["a", "b"]);
  });

  it("rejects unknown or non-numeric columns", () => {
    expect(() => aggregate(rows, columns, { xColumn: "nope", yColumn: "revenue", aggregation: "sum" })).toThrow(/Unknown/);
    expect(() => aggregate(rows, columns, { xColumn: "date", yColumn: "region", aggregation: "sum" })).toThrow(/not numeric/);
  });
});

describe("suggestChart", () => {
  it("prefers a line chart for date + number", () => {
    expect(suggestChart(columns)).toMatchObject({ type: "line", xColumn: "date", yColumn: "revenue" });
  });

  it("uses a bar chart for category + number", () => {
    expect(suggestChart(columns.filter((c) => c.type !== "date"))).toMatchObject({
      type: "bar",
      xColumn: "region",
      aggregation: "sum",
    });
  });

  it("counts rows when there is no numeric column", () => {
    expect(suggestChart(columns.filter((c) => c.name === "region"))).toMatchObject({ aggregation: "count" });
  });

  it("returns null when nothing is chartable", () => {
    expect(suggestChart([{ name: "id", type: "string", nullCount: 0, uniqueCount: 1000 }])).toBeNull();
  });
});
