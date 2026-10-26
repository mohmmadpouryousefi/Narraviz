"use client";

import { useMemo } from "react";
import type { Dataset } from "@/types/dataset";
import type { ChartSpec } from "@/types/story";
import { aggregate } from "@/lib/formatData";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";

/** Renders a chart spec against a dataset; shows a message instead of crashing if the spec doesn't fit the data. */
export function ChartView({ spec, dataset, height = 320 }: { spec: ChartSpec; dataset: Dataset; height?: number }) {
  const result = useMemo(() => {
    try {
      return {
        points: aggregate(dataset.rows, dataset.columns, spec, { limit: spec.type === "bar" ? 12 : undefined }),
        error: null,
      };
    } catch (e) {
      return { points: [], error: e instanceof Error ? e.message : "This chart can't be drawn." };
    }
  }, [dataset, spec]);

  if (result.error) {
    return (
      <p role="alert" className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        {result.error}
      </p>
    );
  }

  const xType = dataset.columns.find((c) => c.name === spec.xColumn)?.type ?? "string";
  const yLabel = spec.aggregation === "count" ? "Rows" : `${spec.yColumn} (${spec.aggregation})`;
  const Chart = spec.type === "line" ? LineChart : BarChart;
  return <Chart data={result.points} xType={xType} xLabel={spec.xColumn} yLabel={yLabel} height={height} />;
}
