import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { count, eq } from "drizzle-orm";
import { exportHistory } from "~/db/schema/export_history";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import { openSingleUserExportContext, type SingleUserExportContext } from "~/test/exportHistoryTestContext";

describe("POST /api/export export_history persistence", () => {
  let ctx: SingleUserExportContext;

  beforeEach(async () => {
    ctx = await openSingleUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN the pattern id is unknown", () => {
    describe("AND export_history is queried after the failed export", () => {
      it("returns zero rows for the user", async () => {
        const unknownId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
        await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [unknownId] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const [row] = await ctx.database
          .select({ c: count() })
          .from(exportHistory)
          .where(eq(exportHistory.userId, ctx.userId));
        expect(row.c).toBe(0);
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND duplicate ids are posted in one export", () => {
      describe("AND the HTTP response is checked", () => {
        it("returns status 200", async () => {
          const created = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "x", title: "Doc" },
            userId: ctx.userId,
          });
          const res = await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [created.id, created.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          expect(res.status).toBe(200);
        });
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND duplicate ids are posted in one export", () => {
      describe("AND export_history rows are counted", () => {
        it("returns exactly one row", async () => {
          const created = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "x", title: "Doc" },
            userId: ctx.userId,
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [created.id, created.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const rows = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userId));
          expect(rows.length).toBe(1);
        });
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND duplicate ids are posted in one export", () => {
      describe("AND the stored pattern_ids array is read", () => {
        it("lists the id once", async () => {
          const created = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "x", title: "Doc" },
            userId: ctx.userId,
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [created.id, created.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const rows = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userId));
          expect(rows[0].patternIds).toEqual([created.id]);
        });
      });
    });
  });
});
