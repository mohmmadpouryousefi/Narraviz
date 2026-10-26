// @vitest-environment node
/**
 * Integration tests: real route handlers against a real Postgres (DATABASE_URL).
 * Only the session is mocked. Skipped when no database is configured.
 */
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ userId: null as string | null }));
vi.mock("@/auth", () => ({
  auth: async () => (session.userId ? { user: { id: session.userId } } : null),
}));

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("API", async () => {
  const { db } = await import("@/lib/db");
  const datasets = await import("@/app/api/datasets/route");
  const dataset = await import("@/app/api/datasets/[id]/route");
  const stories = await import("@/app/api/stories/route");
  const story = await import("@/app/api/stories/[id]/route");

  const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
  const CSV = "date,region,revenue\n2024-01-01,EU,100\n2024-01-02,US,250\n2024-01-03,EU,NA\n";

  function upload(csv: string, name?: string) {
    const form = new FormData();
    form.set("file", new File([csv], "sales.csv", { type: "text/csv" }));
    if (name) form.set("name", name);
    return datasets.POST(new Request("http://test/api/datasets", { method: "POST", body: form }));
  }

  function json(method: string, body: unknown) {
    return new Request("http://test", {
      method,
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  let alice: string;
  let bob: string;

  beforeEach(async () => {
    await db.$executeRawUnsafe('TRUNCATE "User" CASCADE');
    alice = (await db.user.create({ data: { email: "alice@example.com", name: "Alice" } })).id;
    bob = (await db.user.create({ data: { email: "bob@example.com", name: "Bob" } })).id;
    session.userId = alice;
  });

  afterAll(async () => {
    await db.$executeRawUnsafe('TRUNCATE "User" CASCADE');
    await db.$disconnect();
  });

  describe("authentication", () => {
    it("rejects every endpoint without a session", async () => {
      session.userId = null;
      const responses = await Promise.all([
        datasets.GET(),
        upload(CSV),
        dataset.GET(new Request("http://test"), ctx("x")),
        stories.GET(),
        stories.POST(json("POST", { datasetId: "x" })),
        story.PATCH(json("PATCH", { title: "x" }), ctx("x")),
        story.DELETE(new Request("http://test"), ctx("x")),
      ]);
      expect(responses.map((r) => r.status)).toEqual([401, 401, 401, 401, 401, 401, 401]);
    });
  });

  describe("datasets", () => {
    it("parses an upload on the server and lists it without rows", async () => {
      const res = await upload(CSV, "Q1 sales");
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.dataset).toMatchObject({ name: "Q1 sales", rowCount: 3, columnCount: 3 });
      expect(body.dataset).not.toHaveProperty("rows");

      const list = await (await datasets.GET()).json();
      expect(list.datasets).toHaveLength(1);
      expect(list.datasets[0]).not.toHaveProperty("rows");

      const full = await (await dataset.GET(new Request("http://test"), ctx(body.dataset.id))).json();
      expect(full.dataset.columns.map((c: { type: string }) => c.type)).toEqual(["date", "string", "number"]);
      expect(full.dataset.rows[2]).toEqual({ date: "2024-01-03", region: "EU", revenue: null });
    });

    it("defaults the name to the file name", async () => {
      const body = await (await upload(CSV)).json();
      expect(body.dataset.name).toBe("sales");
    });

    it("returns parser errors as 400", async () => {
      const res = await upload("only,a,header\n");
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/no data rows/);
    });

    it("rejects a declared body larger than the limit before reading it", async () => {
      const req = new Request("http://test/api/datasets", {
        method: "POST",
        headers: { "content-length": String(50 * 1024 * 1024) },
        body: "x",
      });
      expect((await datasets.POST(req)).status).toBe(413);
    });

    it("hides other users' datasets (404, not 403)", async () => {
      const { dataset: created } = await (await upload(CSV)).json();
      session.userId = bob;

      expect((await datasets.GET().then((r) => r.json())).datasets).toEqual([]);
      expect((await dataset.GET(new Request("http://test"), ctx(created.id))).status).toBe(404);
      expect((await dataset.PATCH(json("PATCH", { name: "pwned" }), ctx(created.id))).status).toBe(404);
      expect((await dataset.DELETE(new Request("http://test"), ctx(created.id))).status).toBe(404);

      session.userId = alice;
      const still = await (await dataset.GET(new Request("http://test"), ctx(created.id))).json();
      expect(still.dataset.name).toBe("sales");
    });

    it("renames and deletes", async () => {
      const { dataset: created } = await (await upload(CSV)).json();
      const renamed = await (await dataset.PATCH(json("PATCH", { name: "  Renamed " }), ctx(created.id))).json();
      expect(renamed.dataset.name).toBe("Renamed");

      expect((await dataset.PATCH(json("PATCH", { rowCount: 0 }), ctx(created.id))).status).toBe(400);
      expect((await dataset.PATCH(json("PATCH", "not json"), ctx(created.id))).status).toBe(400);

      expect((await dataset.DELETE(new Request("http://test"), ctx(created.id))).status).toBe(204);
      expect((await dataset.GET(new Request("http://test"), ctx(created.id))).status).toBe(404);
    });
  });

  describe("stories", () => {
    async function createStory() {
      const { dataset: ds } = await (await upload(CSV)).json();
      const res = await stories.POST(json("POST", { datasetId: ds.id }));
      return { ds, res, body: await res.json() };
    }

    it("creates a draft with a suggested chart", async () => {
      const { res, body } = await createStory();
      expect(res.status).toBe(201);
      expect(body.story).toMatchObject({ title: "sales story", status: "draft", datasetName: "sales" });
      expect(body.story.blocks.find((b: { type: string }) => b.type === "chart").chart).toMatchObject({
        type: "line",
        xColumn: "date",
        yColumn: "revenue",
      });
    });

    it("cannot be created from another user's dataset", async () => {
      const { dataset: ds } = await (await upload(CSV)).json();
      session.userId = bob;
      expect((await stories.POST(json("POST", { datasetId: ds.id }))).status).toBe(404);
    });

    it("updates fields and validates chart columns against the dataset", async () => {
      const { body } = await createStory();
      const id = body.story.id;

      const ok = await story.PATCH(json("PATCH", { title: "Revenue up", status: "published" }), ctx(id));
      expect((await ok.json()).story).toMatchObject({ title: "Revenue up", status: "published" });

      const bad = await story.PATCH(
        json("PATCH", {
          blocks: [{ id: "c", type: "chart", caption: "", chart: { type: "bar", xColumn: "missing", yColumn: "revenue", aggregation: "sum", title: "" } }],
        }),
        ctx(id),
      );
      expect(bad.status).toBe(400);
      expect((await bad.json()).fields).toHaveProperty(["blocks.0.chart.xColumn"]);
    });

    it("hides other users' stories", async () => {
      const { body } = await createStory();
      session.userId = bob;
      expect((await stories.GET().then((r) => r.json())).stories).toEqual([]);
      expect((await story.GET(new Request("http://test"), ctx(body.story.id))).status).toBe(404);
      expect((await story.PATCH(json("PATCH", { title: "x" }), ctx(body.story.id))).status).toBe(404);
      expect((await story.DELETE(new Request("http://test"), ctx(body.story.id))).status).toBe(404);
    });

    it("is deleted together with its dataset", async () => {
      const { ds, body } = await createStory();
      await dataset.DELETE(new Request("http://test"), ctx(ds.id));
      expect((await story.GET(new Request("http://test"), ctx(body.story.id))).status).toBe(404);
    });
  });
});
