/** Type inferred for a whole column from its non-empty values. */
export type ColumnType = "number" | "date" | "boolean" | "string";

/** A single parsed cell. Dates are stored as ISO 8601 strings so rows stay JSON-serializable. */
export type CellValue = string | number | boolean | null;

export type DataRow = Record<string, CellValue>;

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  /** Number of empty or null-like cells ("", "NA", "N/A", "null", "-"). */
  nullCount: number;
  uniqueCount: number;
}

/** Output of the CSV parser, before the dataset is saved. */
export interface ParsedDataset {
  columns: ColumnMeta[];
  rows: DataRow[];
  /** Rows kept after limits were applied. */
  rowCount: number;
  /** True when the file had more rows than the limit and the rest were not read. */
  truncated: boolean;
  warnings: string[];
}

export interface DatasetSummary {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset extends DatasetSummary {
  columns: ColumnMeta[];
  rows: DataRow[];
}

/** One point in a chart series, produced by aggregating dataset rows. */
export interface ChartPoint {
  x: string | number;
  y: number;
}
