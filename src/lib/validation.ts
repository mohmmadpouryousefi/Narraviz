import { z } from "zod";

// ---------- Auth ----------

const email = z.string().trim().toLowerCase().pipe(z.email({ error: "Enter a valid email address." })).pipe(z.string().max(254));

export const signInSchema = z.object({
  email,
  // Upper bound keeps hashing cost predictable; no other rules on sign-in so old passwords still work.
  password: z.string().min(1, { error: "Enter your password." }).max(128),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter your name." }).max(80),
  email,
  password: z
    .string()
    .min(8, { error: "Use at least 8 characters." })
    .max(128, { error: "Use at most 128 characters." }),
});

/** Only same-site relative paths are allowed as post-login redirects (prevents open redirects). */
export function safeCallbackUrl(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}

// ---------- Ids ----------

export const idSchema = z.string().min(1).max(64).regex(/^[a-z0-9]+$/i);

// ---------- Datasets ----------

export const datasetNameSchema = z.string().trim().min(1, { error: "Name is required." }).max(120);

export const datasetPatchSchema = z.object({ name: datasetNameSchema }).strict();

// ---------- Stories ----------

export const chartSpecSchema = z
  .object({
    type: z.enum(["bar", "line"]),
    xColumn: z.string().min(1).max(200),
    yColumn: z.string().min(1).max(200).nullable(),
    aggregation: z.enum(["sum", "avg", "count", "min", "max"]),
    title: z.string().trim().max(200),
  })
  .strict()
  .refine((c) => c.aggregation === "count" || c.yColumn !== null, {
    error: "A y column is required unless the aggregation is count.",
    path: ["yColumn"],
  });

export const insightSchema = z
  .object({
    kind: z.enum(["summary", "trend", "outlier", "correlation", "top"]),
    title: z.string().max(200),
    detail: z.string().max(2000),
    columns: z.array(z.string().max(200)).max(10),
    score: z.number().min(0).max(1),
  })
  .strict();

const blockId = z.string().min(1).max(64);

export const storyBlockSchema = z.discriminatedUnion("type", [
  z.object({ id: blockId, type: z.literal("text"), content: z.string().max(5000) }).strict(),
  z.object({ id: blockId, type: z.literal("chart"), chart: chartSpecSchema, caption: z.string().max(1000) }).strict(),
  z.object({ id: blockId, type: z.literal("insight"), insight: insightSchema }).strict(),
]);

export const storyBlocksSchema = z
  .array(storyBlockSchema)
  .max(50, { error: "A story can have at most 50 blocks." })
  .refine((blocks) => new Set(blocks.map((b) => b.id)).size === blocks.length, { error: "Block ids must be unique." });

export const storyCreateSchema = z
  .object({
    datasetId: idSchema,
    title: z.string().trim().min(1).max(200).optional(),
  })
  .strict();

export const storyPatchSchema = z
  .object({
    title: z.string().trim().min(1, { error: "Title is required." }).max(200),
    description: z.string().trim().max(1000),
    status: z.enum(["draft", "published"]),
    blocks: storyBlocksSchema,
  })
  .partial()
  .strict()
  .refine((p) => Object.keys(p).length > 0, { error: "Nothing to update." });

/** Flattens Zod issues into { field: message } for forms and API responses. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    out[key] ??= issue.message;
  }
  return out;
}
