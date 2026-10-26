import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { storyCreateSchema } from "@/lib/validation";
import { initialBlocks } from "@/lib/storyBlocks";
import {
  currentUserId,
  notFound,
  readJson,
  storySummarySelect,
  toStory,
  toStorySummary,
  unauthorized,
  validationError,
} from "@/lib/api";
import type { Prisma } from "@/generated/prisma/client";
import type { ColumnMeta } from "@/types/dataset";

/** GET /api/stories: the signed-in user's stories, most recently edited first. */
export async function GET() {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  const stories = await db.story.findMany({
    where: { userId },
    select: storySummarySelect,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ stories: stories.map(toStorySummary) });
}

/** POST /api/stories { datasetId, title? }: creates a draft story from one of the user's datasets. */
export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  const body = await readJson(request);
  if (!body.ok) return body.response;
  const input = storyCreateSchema.safeParse(body.data);
  if (!input.success) return validationError(input.error);

  // The dataset must belong to the same user; otherwise it is reported as not found.
  const dataset = await db.dataset.findFirst({
    where: { id: input.data.datasetId, userId },
    select: { id: true, name: true, columns: true },
  });
  if (!dataset) return notFound("Dataset not found.");

  const story = await db.story.create({
    data: {
      userId,
      datasetId: dataset.id,
      title: input.data.title ?? `${dataset.name} story`,
      blocks: initialBlocks(dataset.columns as unknown as ColumnMeta[]) as unknown as Prisma.InputJsonValue,
    },
    select: { ...storySummarySelect, blocks: true, narrativeSource: true },
  });
  return NextResponse.json({ story: toStory(story) }, { status: 201 });
}
