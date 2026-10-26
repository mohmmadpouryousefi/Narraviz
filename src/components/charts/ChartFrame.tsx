import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";

export function ChartFrame({
  label,
  height,
  width,
  children,
}: {
  label: string;
  height: number;
  width?: number;
  children: ReactNode;
}) {
  return (
    <figure role="figure" aria-label={label} className="w-full" style={{ minHeight: height, maxWidth: width }}>
      {children}
    </figure>
  );
}

export function ChartEmptyState({ height }: { height: number }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground"
      style={{ height }}
    >
      <BarChart3 className="h-6 w-6" aria-hidden />
      No data to chart
    </div>
  );
}
