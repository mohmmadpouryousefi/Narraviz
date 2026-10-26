import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { idSchema, storyPatchSchema } from "@/lib/validation";
import { validateBlocksAgainstColumns } from "@/lib/storyBlocks";
import {
  currentUserId,
  jsonError,
  notFound,
  readJson,
  storySummarySelect,
  toStory,
  unauthorized,
  validationError,
} from "@/lib/api";
import type { Prisma } from "@/generated/prisma/client";
import type { ColumnMeta } from "@/types/dataset";
import type { StoryBlock } from "@/types/story";

type Context = { params: Promise<{ id: string }> };

const STORY_NOT_FOUND = "Story not found.";
const storySelect = { ...storySummarySelect, blocks: true, narrativeSource: true } as const;

/** GET /api/stories/:id */
export async function GET(_request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(STORY_NOT_FOUND);

  const story = await db.story.findFirst({ where: { id: id.data, userId }, select: storySelect });
  if (!story) return notFound(STORY_NOT_FOUND);
  return NextResponse.json({ story: toStory(story) });
}

/** PATCH /api/stories/:id { title?, description?, status?, blocks? } */
export async function PATCH(request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(STORY_NOT_FOUND);

  const body = await readJson(request);
  if (!body.ok) return body.response;
  const patch = storyPatchSchema.safeParse(body.data);
  if (!patch.success) return validationError(patch.error);

  const existing = await db.story.findFirst({
    where: { id: id.data, userId },
    select: { id: true, dataset: { select: { columns: true } } },
  });
  if (!existing) return notFound(STORY_NOT_FOUND);

  const { blocks, ...fields } = patch.data;
  if (blocks) {
    const errors = validateBlocksAgainstColumns(
      blocks as StoryBlock[],
      existing.dataset.columns as unknown as ColumnMeta[],
    );
    if (errors) return jsonError(400, "A chart references a column that doesn't exist.", errors);
  }

  const story = await db.story.update({
    where: { id: existing.id },
    data: {
      ...fields,
      ...(blocks ? { blocks: blocks as unknown as Prisma.InputJsonValue } : {}),
    },
    select: storySelect,
  });
  return NextResponse.json({ story: toStory(story) });
}

/** DELETE /api/stories/:id */
export async function DELETE(_request: Request, { params }: Context) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return notFound(STORY_NOT_FOUND);

  const { count } = await db.story.deleteMany({ where: { id: id.data, userId } });
  if (count === 0) return notFound(STORY_NOT_FOUND);
  return new NextResponse(null, { status: 204 });
}
