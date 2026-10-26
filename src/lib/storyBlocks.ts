import type { ColumnMeta } from "@/types/dataset";
import type { StoryBlock } from "@/types/story";

/**
 * Checks that every chart in a story only references columns that exist in its dataset,
 * with a numeric y column. Returns field errors keyed like "blocks.2.chart.xColumn".
 */
export function validateBlocksAgainstColumns(
  blocks: readonly StoryBlock[],
  columns: readonly ColumnMeta[],
): Record<string, string> | null {
  const byName = new Map(columns.map((c) => [c.name, c]));
  const errors: Record<string, string> = {};

  blocks.forEach((block, i) => {
    if (block.type !== "chart") return;
    const { xColumn, yColumn, aggregation } = block.chart;
    if (!byName.has(xColumn)) errors[`blocks.${i}.chart.xColumn`] = `Unknown column "${xColumn}".`;
    if (aggregation !== "count" && yColumn !== null) {
      const y = byName.get(yColumn);
      if (!y) errors[`blocks.${i}.chart.yColumn`] = `Unknown column "${yColumn}".`;
      else if (y.type !== "number") errors[`blocks.${i}.chart.yColumn`] = `Column "${yColumn}" is not numeric.`;
    }
  });

  return Object.keys(errors).length ? errors : null;
}

let counter = 0;
/** Short unique id for a block; stable enough for React keys and edits within one story. */
export function newBlockId(): string {
  counter = (counter + 1) % 1_000_000;
  return `${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
