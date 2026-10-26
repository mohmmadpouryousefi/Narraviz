import { describe, expect, it } from "vitest";
import {
  fieldErrors,
  safeCallbackUrl,
  signUpSchema,
  storyBlocksSchema,
  storyPatchSchema,
} from "@/lib/validation";
import { initialBlocks, validateBlocksAgainstColumns } from "@/lib/storyBlocks";
import type { ColumnMeta } from "@/types/dataset";

describe("safeCallbackUrl", () => {
  it.each([
    ["/dashboard/stories", "/dashboard/stories"],
    ["https://evil.example", "/dashboard"],
    ["//evil.example", "/dashboard"],
    ["/\\evil.example", "/dashboard"],
    [undefined, "/dashboard"],
    [42, "/dashboard"],
  ])("%j -> %j", (input, expected) => {
    expect(safeCallbackUrl(input)).toBe(expected);
  });
});

describe("signUpSchema", () => {
  it("normalizes email and trims name", () => {
    const result = signUpSchema.parse({ name: "  Ada ", email: " Ada@Example.COM ", password: "longenough" });
    expect(result).toEqual({ name: "Ada", email: "ada@example.com", password: "longenough" });
  });

  it("reports field errors", () => {
    const result = signUpSchema.safeParse({ name: "", email: "nope", password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrors(result.error)).sort()).toEqual(["email", "name", "password"]);
    }
  });
});

describe("story schemas", () => {
  const chart = { type: "bar", xColumn: "region", yColumn: "revenue", aggregation: "sum", title: "" } as const;

  it("accepts valid blocks", () => {
    expect(
      storyBlocksSchema.safeParse([
        { id: "a", type: "text", content: "Hello" },
        { id: "b", type: "chart", chart, caption: "" },
      ]).success,
    ).toBe(true);
  });

  it("rejects duplicate ids, unknown block types and extra fields", () => {
    expect(storyBlocksSchema.safeParse([{ id: "a", type: "text", content: "" }, { id: "a", type: "text", content: "" }]).success).toBe(false);
    expect(storyBlocksSchema.safeParse([{ id: "a", type: "html", content: "<script>" }]).success).toBe(false);
    expect(storyBlocksSchema.safeParse([{ id: "a", type: "text", content: "", html: "<b>" }]).success).toBe(false);
  });

  it("requires a y column unless counting", () => {
    const missingY = { id: "c", type: "chart", chart: { ...chart, yColumn: null }, caption: "" };
    expect(storyBlocksSchema.safeParse([missingY]).success).toBe(false);
    const count = { ...missingY, chart: { ...missingY.chart, aggregation: "count" } };
    expect(storyBlocksSchema.safeParse([count]).success).toBe(true);
  });

  it("rejects an empty patch and unknown fields", () => {
    expect(storyPatchSchema.safeParse({}).success).toBe(false);
    expect(storyPatchSchema.safeParse({ userId: "someone-else" }).success).toBe(false);
    expect(storyPatchSchema.safeParse({ status: "published" }).success).toBe(true);
  });
});

describe("validateBlocksAgainstColumns", () => {
  const columns: ColumnMeta[] = [
    { name: "region", type: "string", nullCount: 0, uniqueCount: 3 },
    { name: "revenue", type: "number", nullCount: 0, uniqueCount: 10 },
  ];

  it("passes when charts reference real columns", () => {
    expect(validateBlocksAgainstColumns(initialBlocks(columns), columns)).toBeNull();
  });

  it("flags unknown and non-numeric columns by block index", () => {
    const errors = validateBlocksAgainstColumns(
      [
        { id: "t", type: "text", content: "" },
        { id: "c", type: "chart", caption: "", chart: { type: "bar", xColumn: "nope", yColumn: "region", aggregation: "sum", title: "" } },
      ],
      columns,
    );
    expect(errors).toEqual({
      "blocks.1.chart.xColumn": 'Unknown column "nope".',
      "blocks.1.chart.yColumn": 'Column "region" is not numeric.',
    });
  });
});
