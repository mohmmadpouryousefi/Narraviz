"use client";

import { Badge } from "@/components/ui/badge";
import { InlineError } from "@/components/common/PageHeader";
import { useDataset } from "@/hooks/useDataset";
import { formatCell } from "@/lib/formatData";

const PREVIEW_ROWS = 10;

export function DatasetPreview({ id }: { id: string }) {
  const { dataset, loading, error } = useDataset(id);

  if (loading) return <div className="h-32 animate-pulse rounded-md bg-muted" aria-busy="true" />;
  if (error) return <InlineError>{error}</InlineError>;
  if (!dataset) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {dataset.columns.map((c) => (
          <Badge key={c.name} variant="secondary" className="font-normal">
            {c.name}
            <span className="ml-1 text-muted-foreground">· {c.type}</span>
            {c.nullCount > 0 && <span className="ml-1 text-data-warning">· {c.nullCount} empty</span>}
          </Badge>
        ))}
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {dataset.columns.map((c) => (
                <th key={c.name} scope="col" className={`whitespace-nowrap px-3 py-2 font-medium ${c.type === "number" ? "text-right" : "text-left"}`}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.rows.slice(0, PREVIEW_ROWS).map((row, i) => (
              <tr key={i} className="border-t">
                {dataset.columns.map((c) => (
                  <td key={c.name} className={`whitespace-nowrap px-3 py-1.5 ${c.type === "number" ? "text-right tabular-nums" : ""}`}>
                    {formatCell(row[c.name] ?? null, c.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dataset.rowCount > PREVIEW_ROWS && (
        <p className="text-xs text-muted-foreground">
          Showing {PREVIEW_ROWS} of {dataset.rowCount.toLocaleString("en-US")} rows.
        </p>
      )}
    </div>
  );
}
