import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { auth } from "@/auth";
import { fieldErrors } from "@/lib/validation";
import type { ColumnMeta, DataRow, Dataset, DatasetSummary } from "@/types/dataset";
import type { Story, StoryBlock, StoryStatus, StorySummary } from "@/types/story";

export type ApiError = { error: string; fields?: Record<string, string> };

export function jsonError(status: number, error: string, fields?: Record<string, string>) {
  return NextResponse.json<ApiError>(fields ? { error, fields } : { error }, { status });
}

export const unauthorized = () => jsonError(401, "Sign in to continue.");
/** Used both for missing records and records owned by someone else, so ids can't be probed. */
export const notFound = (what = "Not found") => jsonError(404, what);

export function validationError(error: z.ZodError) {
  return jsonError(400, "Invalid request.", fieldErrors(error));
}

/** The signed-in user's id, or null. Every route checks this before touching data. */
export async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function readJson(request: Request): Promise<{ ok: true; data: unknown } | { ok: false; response: NextResponse }> {
  try {
    return { ok: true, data: await request.json() };
  } catch {
    return { ok: false, response: jsonError(400, "Request body must be valid JSON.") };
  }
}

// ---------- Serializers: database rows -> API types ----------

type DatasetRecord = {
  id: string;
  name: string;
  rowCount: number;
  columns: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const datasetSummarySelect = {
  id: true,
  name: true,
  rowCount: true,
  columns: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function toDatasetSummary(d: DatasetRecord): DatasetSummary {
  return {
    id: d.id,
    name: d.name,
    rowCount: d.rowCount,
    columnCount: (d.columns as ColumnMeta[]).length,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

export function toDataset(d: DatasetRecord & { rows: unknown }): Dataset {
  return { ...toDatasetSummary(d), columns: d.columns as ColumnMeta[], rows: d.rows as DataRow[] };
}

type StoryRecord = {
  id: string;
  title: string;
  description: string;
  status: StoryStatus;
  datasetId: string;
  createdAt: Date;
  updatedAt: Date;
  dataset: { name: string };
};

export const storySummarySelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  datasetId: true,
  createdAt: true,
  updatedAt: true,
  dataset: { select: { name: true } },
} as const;

export function toStorySummary(s: StoryRecord): StorySummary {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    status: s.status,
    datasetId: s.datasetId,
    datasetName: s.dataset.name,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

export function toStory(s: StoryRecord & { blocks: unknown; narrativeSource: string | null }): Story {
  return {
    ...toStorySummary(s),
    blocks: s.blocks as StoryBlock[],
    narrativeSource: s.narrativeSource === "ai" || s.narrativeSource === "stats" ? s.narrativeSource : null,
  };
}
