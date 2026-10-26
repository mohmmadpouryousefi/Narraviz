import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { datasetPatchSchema, idSchema } from "@/lib/validation";
import {
  currentUserId,
  datasetSummarySelect,
  notFound,
  readJson,
  toDataset,
  toDatasetSummary,
  unauthorized,
  validationError,
} from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

const DATASET_NOT_FOUND = "Dataset not found.";

/** GET /api/datasets/:id: the full dataset including rows. */
export async function GET(_request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(DATASET_NOT_FOUND);

  // Filtering by userId in the query (not after) means another user's id returns nothing.
  const dataset = await db.dataset.findFirst({
    where: { id: id.data, userId },
    select: { ...datasetSummarySelect, rows: true },
  });
  if (!dataset) return notFound(DATASET_NOT_FOUND);
  return NextResponse.json({ dataset: toDataset(dataset) });
}

/** PATCH /api/datasets/:id { name } */
export async function PATCH(request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(DATASET_NOT_FOUND);

  const body = await readJson(request);
  if (!body.ok) return body.response;
  const patch = datasetPatchSchema.safeParse(body.data);
  if (!patch.success) return validationError(patch.error);

  const { count } = await db.dataset.updateMany({ where: { id: id.data, userId }, data: patch.data });
  if (count === 0) return notFound(DATASET_NOT_FOUND);

  const dataset = await db.dataset.findUniqueOrThrow({ where: { id: id.data }, select: datasetSummarySelect });
  return NextResponse.json({ dataset: toDatasetSummary(dataset) });
}

/** DELETE /api/datasets/:id: also deletes the stories built on it. */
export async function DELETE(_request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(DATASET_NOT_FOUND);

  const { count } = await db.dataset.deleteMany({ where: { id: id.data, userId } });
  if (count === 0) return notFound(DATASET_NOT_FOUND);
  return new NextResponse(null, { status: 204 });
}
