"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, ColumnType } from "@/types/dataset";
import { formatAxisValue, formatNumber } from "@/lib/formatData";
import { ChartEmptyState, ChartFrame } from "./ChartFrame";

export interface LineChartProps {
  data: ChartPoint[];
  xType: ColumnType;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  /** Fixed width; omit to fill the parent. */
  width?: number;
  color?: string;
}

export function LineChart({ data, xType, xLabel, yLabel, height = 320, width, color = "#00D4AA" }: LineChartProps) {
  if (data.length === 0) return <ChartEmptyState height={height} />;

  const chart = (
    <RechartsLineChart data={data} width={width} height={height} margin={{ top: 8, right: 16, bottom: 24, left: 8 }} accessibilityLayer>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis
        dataKey="x"
        tickFormatter={(v: string | number) => formatAxisValue(v, xType)}
        minTickGap={24}
        tick={{ fontSize: 12 }}
        label={xLabel ? { value: xLabel, position: "insideBottom", offset: -16 } : undefined}
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
      <Line
        type="monotone"
        dataKey="y"
        stroke={color}
        strokeWidth={2}
        dot={data.length <= 40}
        isAnimationActive={!width}
      />
    </RechartsLineChart>
  );

  return (
    <ChartFrame label={yLabel && xLabel ? `${yLabel} over ${xLabel}` : "Line chart"} height={height} width={width}>
      {width ? chart : <ResponsiveContainer width="100%" height={height}>{chart}</ResponsiveContainer>}
    </ChartFrame>
  );
}
