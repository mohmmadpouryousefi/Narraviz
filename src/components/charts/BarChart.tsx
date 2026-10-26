"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, ColumnType } from "@/types/dataset";
import { formatAxisValue, formatNumber } from "@/lib/formatData";
import { ChartEmptyState, ChartFrame } from "./ChartFrame";

export interface BarChartProps {
  data: ChartPoint[];
  xType: ColumnType;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  /** Fixed width; omit to fill the parent. */
  width?: number;
  color?: string;
}

export function BarChart({ data, xType, xLabel, yLabel, height = 320, width, color = "#0066FF" }: BarChartProps) {
  if (data.length === 0) return <ChartEmptyState height={height} />;

  const manyCategories = data.length > 8;
  const chart = (
    <RechartsBarChart
      data={data}
      width={width}
      height={height}
      margin={{ top: 8, right: 16, bottom: manyCategories ? 48 : 24, left: 8 }}
      accessibilityLayer
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis
        dataKey="x"
        tickFormatter={(v: string | number) => formatAxisValue(v, xType)}
        angle={manyCategories ? -35 : 0}
        textAnchor={manyCategories ? "end" : "middle"}
        interval={0}
        tick={{ fontSize: 12 }}
        label={xLabel && !manyCategories ? { value: xLabel, position: "insideBottom", offset: -16 } : undefined}
      />
      <YAxis
        tickFormatter={(v: number) => formatNumber(v, { compact: true })}
        tick={{ fontSize: 12 }}
        width={56}
        label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", offset: 0 } : undefined}
      />
      <Tooltip
        formatter={(v) => [formatNumber(Number(v)), yLabel ?? "Value"]}
        labelFormatter={(v) => formatAxisValue(v as string | number, xType)}
      />
      <Bar dataKey="y" fill={color} radius={[4, 4, 0, 0]} isAnimationActive={!width} />
    </RechartsBarChart>
  );

  return (
    <ChartFrame label={yLabel && xLabel ? `${yLabel} by ${xLabel}` : "Bar chart"} height={height} width={width}>
      {width ? chart : <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer>}
    </ChartFrame>
  );
}
