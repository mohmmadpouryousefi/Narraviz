import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CSV_LIMITS, CsvParseError, parseCsv } from "@/lib/csvParser";
import { datasetNameSchema } from "@/lib/validation";
import {
  currentUserId,
  datasetSummarySelect,
  jsonError,
  toDatasetSummary,
  unauthorized,
  validationError,
} from "@/lib/api";
import type { Prisma } from "@/generated/prisma/client";

const MAX_DATASETS_PER_USER = 50;
// Multipart framing adds a little on top of the file itself.
const MAX_REQUEST_BYTES = CSV_LIMITS.maxBytes + 64 * 1024;

/** GET /api/datasets: the signed-in user's datasets, newest first, without row data. */
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  const datasets = await db.dataset.findMany({
    where: { userId },
    select: datasetSummarySelect,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ datasets: datasets.map(toDatasetSummary) });
}

/**
 * POST /api/datasets (multipart/form-data: file, optional name)
 * The CSV is parsed on the server; types sent by a client are never trusted.
 */
export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  // Reject oversized uploads before reading the body.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_REQUEST_BYTES) {
    return jsonError(413, `File is too large; the limit is ${CSV_LIMITS.maxBytes / (1024 * 1024)} MB.`);
  }

  const count = await db.dataset.count({ where: { userId } });
  if (count >= MAX_DATASETS_PER_USER) {
    return jsonError(409, `You can keep up to ${MAX_DATASETS_PER_USER} datasets. Delete one to upload another.`);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Expected a multipart form with a CSV file.");
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError(400, "Choose a CSV file to upload.", { file: "A non-empty CSV file is required." });
  }
  if (file.size > CSV_LIMITS.maxBytes) {
    return jsonError(413, `File is too large; the limit is ${CSV_LIMITS.maxBytes / (1024 * 1024)} MB.`);
  }

  const rawName = form.get("name");
  const nameResult = datasetNameSchema.safeParse(
    typeof rawName === "string" && rawName.trim() ? rawName : file.name.replace(/\.(csv|txt)$/i, ""),
  );
  if (!nameResult.success) return validationError(nameResult.error);

  let parsed;
  try {
    parsed = parseCsv(await file.text());
  } catch (error) {
    if (error instanceof CsvParseError) return jsonError(400, error.message, { file: error.message });
    throw error;
  }

  const dataset = await db.dataset.create({
    data: {
      userId,
      name: nameResult.data,
      rowCount: parsed.rowCount,
      columns: parsed.columns as unknown as Prisma.InputJsonValue,
      rows: parsed.rows as unknown as Prisma.InputJsonValue,
    },
    select: datasetSummarySelect,
  });

  return NextResponse.json(
    { dataset: toDatasetSummary(dataset), warnings: parsed.warnings, truncated: parsed.truncated },
    { status: 201 },
  );
}
