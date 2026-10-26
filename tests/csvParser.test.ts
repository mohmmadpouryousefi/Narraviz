import { describe, expect, it } from "vitest";
import {
  CsvParseError,
  inferColumnType,
  normalizeHeaders,
  parseCsv,
  parseDate,
  parseNumber,
} from "@/lib/csvParser";

describe("parseNumber", () => {
  it.each([
    ["42", 42],
    ["-3.5", -3.5],
    ["+7", 7],
    [".5", 0.5],
    ["1e3", 1000],
    ["1,234,567.89", 1234567.89],
    ["  12 ", 12],
  ])("parses %j", (raw, expected) => {
    expect(parseNumber(raw)).toBe(expected);
  });

  it.each(["abc", "1,5", "12a", "", "1.2.3", "$5"])("rejects %j", (raw) => {
    expect(parseNumber(raw)).toBeNull();
  });
});

describe("parseDate", () => {
  it("keeps date-only values as YYYY-MM-DD", () => {
    expect(parseDate("2024-03-05")).toBe("2024-03-05");
    expect(parseDate("2024/3/5")).toBe("2024-03-05");
  });

  it("normalizes timestamps to ISO", () => {
    expect(parseDate("2024-03-05T10:00:00Z")).toBe("2024-03-05T10:00:00.000Z");
  });

  it("rejects impossible and ambiguous dates", () => {
    expect(parseDate("2024-02-31")).toBeNull();
    expect(parseDate("03/05/2024")).toBeNull(); // US vs EU order is ambiguous
    expect(parseDate("yesterday")).toBeNull();
  });
});

describe("inferColumnType", () => {
  it("ignores null-like tokens when inferring", () => {
    expect(inferColumnType(["1", "NA", "", "3"])).toBe("number");
    expect(inferColumnType(["2024-01-01", "n/a"])).toBe("date");
    expect(inferColumnType(["yes", "No", "TRUE"])).toBe("boolean");
  });

  it("falls back to string when any value does not fit", () => {
    expect(inferColumnType(["1", "2", "three"])).toBe("string");
  });

  it("treats an all-empty column as string", () => {
    expect(inferColumnType(["", "NA"])).toBe("string");
  });
});

describe("normalizeHeaders", () => {
  it("fills blanks and de-duplicates", () => {
    expect(normalizeHeaders(["name", "", "name", " name ", "name_2"])).toEqual([
      "name",
      "column_2",
      "name_2",
      "name_3",
      "name_2_2",
    ]);
  });
});

describe("parseCsv", () => {
  const csv = [
    "date,region,revenue,active",
    "2024-01-01,EU,1200.5,yes",
    "2024-01-02,US,NA,no",
    "2024-01-03,EU,\"1,500\",yes",
  ].join("\n");

  it("infers column types and converts values", () => {
    const result = parseCsv(csv);
    expect(result.columns.map((c) => [c.name, c.type])).toEqual([
      ["date", "date"],
      ["region", "string"],
      ["revenue", "number"],
      ["active", "boolean"],
    ]);
    expect(result.rows[0]).toEqual({ date: "2024-01-01", region: "EU", revenue: 1200.5, active: true });
    expect(result.rows[1].revenue).toBeNull();
    expect(result.rows[2].revenue).toBe(1500);
  });

  it("counts nulls and unique values", () => {
    const revenue = parseCsv(csv).columns.find((c) => c.name === "revenue")!;
    expect(revenue.nullCount).toBe(1);
    expect(revenue.uniqueCount).toBe(2);
  });

  it("strips a UTF-8 BOM from the first header", () => {
    expect(parseCsv("﻿a,b\n1,2").columns[0].name).toBe("a");
  });

  it("handles quoted fields with commas and newlines", () => {
    const result = parseCsv('name,note\n"Doe, Jane","line one\nline two"');
    expect(result.rows[0]).toEqual({ name: "Doe, Jane", note: "line one\nline two" });
  });

  it("pads short rows, drops extra cells, and warns", () => {
    const result = parseCsv("a,b,c\n1,2\n1,2,3,4");
    expect(result.rows).toEqual([
      { a: 1, b: 2, c: null },
      { a: 1, b: 2, c: 3 },
    ]);
    expect(result.warnings.join(" ")).toMatch(/2 row\(s\)/);
  });

  it("truncates to maxRows and reports it", () => {
    const body = Array.from({ length: 10 }, (_, i) => `${i}`).join("\n");
    const result = parseCsv(`n\n${body}`, { maxRows: 4 });
    expect(result.rowCount).toBe(4);
    expect(result.truncated).toBe(true);
    expect(result.rows.map((r) => r.n)).toEqual([0, 1, 2, 3]);
    expect(result.warnings[0]).toMatch(/first 4 rows/);
  });

  it("does not report truncation at exactly maxRows", () => {
    const result = parseCsv("n\n1\n2", { maxRows: 2 });
    expect(result.truncated).toBe(false);
    expect(result.warnings).toEqual([]);
  });

  it("rejects files over the byte limit", () => {
    expect(() => parseCsv("a\n123456", { maxBytes: 4 })).toThrow(CsvParseError);
  });

  it("rejects too many columns", () => {
    expect(() => parseCsv("a,b,c\n1,2,3", { maxColumns: 2 })).toThrow(/3 columns/);
  });

  it("rejects empty input and header-only files", () => {
    expect(() => parseCsv("")).toThrow(/no header/);
    expect(() => parseCsv("a,b\n")).toThrow(/no data rows/);
  });

  it("skips blank lines", () => {
    expect(parseCsv("a\n1\n\n   \n2\n").rowCount).toBe(2);
  });
});
