// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { extractNumbers, statsNarrative, unsupportedNumbers } from "@/lib/narrative";
import { generateNarrative } from "@/lib/aiNarrative";
import type { Insight } from "@/types/story";

const insights: Insight[] = [
  {
    kind: "trend",
    title: "revenue rose from 150 to 315 (+110.0%) between Jan 1, 2024 and Dec 1, 2024",
    detail: "Summed per month, revenue peaked at 315 on Dec 1, 2024.",
    columns: ["month", "revenue"],
    score: 0.9,
  },
  { kind: "top", title: "EU accounts for 66.7% of total revenue", detail: "EU leads with 1,860 of 2,790.", columns: ["region", "revenue"], score: 0.6 },
  { kind: "summary", title: "24 rows across 4 columns", detail: "No values are missing.", columns: [], score: 0.2 },
];

describe("extractNumbers", () => {
  it("normalizes separators, decimals and suffixes", () => {
    expect(extractNumbers("Revenue hit 1,860 (66.7%), about 1.5M overall, down -3")).toEqual([1860, 66.7, 1_500_000, -3]);
  });
});

describe("unsupportedNumbers", () => {
  const sources = insights.flatMap((i) => [i.title, i.detail]);

  it("accepts numbers from the insights, including rounding", () => {
    expect(unsupportedNumbers("Revenue more than doubled, up 110% to 315; EU holds 67% of it.", sources)).toEqual([]);
  });

  it("allows small counts", () => {
    expect(unsupportedNumbers("Across 2 regions and 3 quarters", sources)).toEqual([]);
  });

  it("catches invented numbers", () => {
    expect(unsupportedNumbers("Revenue will reach 500 next year, a 42% jump.", sources)).toEqual([500, 42]);
  });
});

describe("statsNarrative", () => {
  it("leads with the strongest finding", () => {
    const n = statsNarrative("Sales 2024", insights);
    expect(n.source).toBe("stats");
    expect(n.headline).toBe("Revenue rose from 150 to 315 (+110.0%) between Jan 1, 2024 and Dec 1, 2024");
    expect(n.summary).toMatch(/^This story is based on Sales 2024: 24 rows across 4 columns\. The clearest finding: revenue rose/);
    expect(n.summary).toContain("EU accounts for 66.7% of total revenue.");
  });

  it("handles a dataset with no findings", () => {
    const n = statsNarrative("Flat", [insights[2]]);
    expect(n.headline).toBe("A first look at Flat");
    expect(n.summary).toMatch(/No strong trends/);
  });
});

describe("generateNarrative", () => {
  function fakeClient(input: unknown) {
    const create = vi.fn().mockResolvedValue({ content: [{ type: "tool_use", id: "t", name: "write_narrative", input }] });
    return { client: { messages: { create } } as never, create };
  }

  it("falls back to stats without an API key", async () => {
    const n = await generateNarrative("Sales", insights, null);
    expect(n).toMatchObject({ source: "stats", fallbackReason: "no_api_key" });
  });

  it("uses Claude's text when every number is supported", async () => {
    const { client, create } = fakeClient({
      headline: "Revenue more than doubled in 2024",
      summary: "Revenue grew 110% from 150 to 315. The EU brought in 66.7% of it.",
    });
    const n = await generateNarrative("Sales", insights, client);
    expect(n).toEqual({ headline: "Revenue more than doubled in 2024", summary: expect.stringContaining("110%"), source: "ai" });

    // Data is passed inside tags, never as instructions, and a structured tool is forced.
    const request = create.mock.calls[0][0];
    expect(request.tool_choice).toEqual({ type: "tool", name: "write_narrative" });
    expect(request.messages[0].content).toMatch(/<insights>[\s\S]*EU accounts for 66.7%[\s\S]*<\/insights>/);
    expect(request.system).toMatch(/Never compute, estimate or invent a number/);
  });

  it("rejects text with invented numbers", async () => {
    const { client } = fakeClient({ headline: "Revenue up 300%", summary: "Revenue will hit 1,000 next year." });
    const n = await generateNarrative("Sales", insights, client);
    expect(n).toMatchObject({ source: "stats", fallbackReason: "unsupported_numbers" });
  });

  it("rejects malformed output and API errors", async () => {
    const { client } = fakeClient({ headline: "" });
    expect(await generateNarrative("Sales", insights, client)).toMatchObject({ fallbackReason: "invalid_output" });

    const failing = { messages: { create: vi.fn().mockRejectedValue(new Error("529 overloaded")) } } as never;
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await generateNarrative("Sales", insights, failing)).toMatchObject({ fallbackReason: "api_error" });
    errSpy.mockRestore();
  });
});
