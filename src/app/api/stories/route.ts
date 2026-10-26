import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { storyCreateSchema } from "@/lib/validation";
import { generateStory } from "@/lib/storyGenerator";
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
import type { ColumnMeta, DataRow } from "@/types/dataset";

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

/** POST /api/stories { datasetId, title? }: generates a draft story (charts, insights, narrative) from one of the user's datasets. */
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
    select: { id: true, name: true, columns: true, rows: true },
  });
  if (!dataset) return notFound("Dataset not found.");

  // Insights are computed in code; Claude (if configured) only writes the narrative around them.
  const generated = await generateStory(
    dataset.name,
    dataset.columns as unknown as ColumnMeta[],
    dataset.rows as unknown as DataRow[],
  );

  const story = await db.story.create({
    data: {
      userId,
      datasetId: dataset.id,
      title: input.data.title ?? generated.title,
      description: generated.description,
      blocks: generated.blocks as unknown as Prisma.InputJsonValue,
      narrativeSource: generated.narrativeSource,
    },
    select: { ...storySummarySelect, blocks: true, narrativeSource: true },
  });
  return NextResponse.json({ story: toStory(story) }, { status: 201 });
}
