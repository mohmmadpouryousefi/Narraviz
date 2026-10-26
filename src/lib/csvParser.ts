import Papa from "papaparse";
import type { CellValue, ColumnMeta, ColumnType, DataRow, ParsedDataset } from "@/types/dataset";

export const CSV_LIMITS = {
  maxBytes: 10 * 1024 * 1024,
  maxRows: 50_000,
  maxColumns: 200,
} as const;

export interface ParseOptions {
  maxBytes?: number;
  maxRows?: number;
  maxColumns?: number;
}

export class CsvParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvParseError";
  }
}

const NULL_TOKENS = new Set(["", "na", "n/a", "null", "nan", "none", "-"]);
const NUMBER_RE = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
const THOUSANDS_RE = /^[-+]?\d{1,3}(,\d{3})+(\.\d+)?$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const SLASH_DATE_RE = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
const TRUE_TOKENS = new Set(["true", "yes"]);
const FALSE_TOKENS = new Set(["false", "no"]);

function isNullToken(raw: string): boolean {
  return NULL_TOKENS.has(raw.trim().toLowerCase());
}

export function parseNumber(raw: string): number | null {
  const s = raw.trim();
  if (NUMBER_RE.test(s)) return Number(s);
  // "1,234,567.89" is unambiguous; plain "1,5" is not, so it stays a string.
  if (THOUSANDS_RE.test(s)) return Number(s.replace(/,/g, ""));
  return null;
}

export function parseDate(raw: string): string | null {
  const s = raw.trim();
  if (!ISO_DATE_RE.test(s) && !SLASH_DATE_RE.test(s)) return null;
  const normalized = s.replace(/\//g, "-").replace(/-(\d)(?=-|$)/g, "-0$1");
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(normalized);
  const time = Date.parse(dateOnly ? `${normalized}T00:00:00Z` : normalized);
  if (Number.isNaN(time)) return null;
  const iso = new Date(time).toISOString();
  // Date.parse accepts 2024-02-31 by rolling over; reject impossible dates.
  if (dateOnly && iso.slice(0, 10) !== normalized) return null;
  return dateOnly ? iso.slice(0, 10) : iso;
}

function parseBoolean(raw: string): boolean | null {
  const s = raw.trim().toLowerCase();
  if (TRUE_TOKENS.has(s)) return true;
  if (FALSE_TOKENS.has(s)) return false;
  return null;
}

/** A column gets a type only if every non-empty value fits it; otherwise it stays a string. */
export function inferColumnType(values: readonly string[]): ColumnType {
  const present = values.filter((v) => !isNullToken(v));
  if (present.length === 0) return "string";
  if (present.every((v) => parseNumber(v) !== null)) return "number";
  if (present.every((v) => parseDate(v) !== null)) return "date";
  if (present.every((v) => parseBoolean(v) !== null)) return "boolean";
  return "string";
}

function convert(raw: string, type: ColumnType): CellValue {
  if (isNullToken(raw)) return null;
  switch (type) {
    case "number":
      return parseNumber(raw);
    case "date":
      return parseDate(raw);
    case "boolean":
      return parseBoolean(raw);
    case "string":
      return raw.trim();
  }
}

/** Blank headers become column_N; duplicates get a numeric suffix. */
export function normalizeHeaders(headers: readonly string[]): string[] {
  const used = new Set<string>();
  return headers.map((h, i) => {
    const base = h.trim() || `column_${i + 1}`;
    let name = base;
    for (let n = 2; used.has(name); n++) name = `${base}_${n}`;
    used.add(name);
    return name;
  });
}

export function parseCsv(text: string, options: ParseOptions = {}): ParsedDataset {
  const maxBytes = options.maxBytes ?? CSV_LIMITS.maxBytes;
  const maxRows = options.maxRows ?? CSV_LIMITS.maxRows;
  const maxColumns = options.maxColumns ?? CSV_LIMITS.maxColumns;

  const bytes = new TextEncoder().encode(text).length;
  if (bytes > maxBytes) {
    throw new CsvParseError(`File is ${formatBytes(bytes)}; the limit is ${formatBytes(maxBytes)}.`);
  }

  const input = text.replace(/^﻿/, ""); // strip BOM written by Excel
  // Read the header, maxRows rows, and one extra row to detect truncation; the rest is never materialized.
  const result = Papa.parse<string[]>(input, {
    skipEmptyLines: "greedy",
    preview: maxRows + 2,
  });

  const [headerRow, ...body] = result.data;
  if (!headerRow || headerRow.every((h) => h.trim() === "")) {
    throw new CsvParseError("The file has no header row.");
  }
  if (headerRow.length > maxColumns) {
    throw new CsvParseError(`The file has ${headerRow.length} columns; the limit is ${maxColumns}.`);
  }
  if (body.length === 0) {
    throw new CsvParseError("The file has a header row but no data rows.");
  }

  const warnings: string[] = [];
  const truncated = body.length > maxRows;
  const sourceRows = truncated ? body.slice(0, maxRows) : body;
  if (truncated) {
    warnings.push(`Only the first ${maxRows.toLocaleString("en-US")} rows were imported.`);
  }

  const names = normalizeHeaders(headerRow);
  let mismatched = 0;
  const rawRows = sourceRows.map((cells) => {
    if (cells.length !== names.length) mismatched++;
    return names.map((_, i) => cells[i] ?? "");
  });
  if (mismatched > 0) {
    warnings.push(
      `${mismatched} row(s) had a different number of fields than the header; missing cells were left empty and extra cells dropped.`,
    );
  }

  const columns: ColumnMeta[] = names.map((name, i) => {
    const values = rawRows.map((r) => r[i]);
    const type = inferColumnType(values);
    const present = values.filter((v) => !isNullToken(v));
    return {
      name,
      type,
      nullCount: values.length - present.length,
      uniqueCount: new Set(present.map((v) => v.trim())).size,
    };
  });

  const rows: DataRow[] = rawRows.map((cells) => {
    const row: DataRow = {};
    columns.forEach((col, i) => {
      row[col.name] = convert(cells[i], col.type);
    });
    return row;
  });

  return {
    columns,
    rows,
    rowCount: rows.length,
    truncated,
    warnings,
  };
}

/** Browser helper: checks the size before reading so a huge file is never loaded into memory. */
export async function parseCsvFile(file: File, options: ParseOptions = {}): Promise<ParsedDataset> {
  const maxBytes = options.maxBytes ?? CSV_LIMITS.maxBytes;
  if (file.size > maxBytes) {
    throw new CsvParseError(`File is ${formatBytes(file.size)}; the limit is ${formatBytes(maxBytes)}.`);
  }
  if (file.type && !["text/csv", "application/vnd.ms-excel", "text/plain"].includes(file.type)) {
    throw new CsvParseError("Only CSV files are supported.");
  }
  return parseCsv(await file.text(), options);
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
