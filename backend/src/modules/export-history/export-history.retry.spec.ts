import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { exportHistory } from "~/db/schema/export_history";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import {
  openSingleUserExportContext,
  openTwoUserExportContext,
  type SingleUserExportContext,
  type TwoUserExportContext,
} from "~/test/exportHistoryTestContext";

describe("POST /api/export/retry", () => {
  let ctx: SingleUserExportContext;

  beforeEach(async () => {
    ctx = await openSingleUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN a history row exists for the user", () => {
    describe("AND retry is posted", () => {
      describe("AND the response status is checked", () => {
        it("returns 200", async () => {
          const created = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "z", title: "Z" },
            userId: ctx.userId,
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [created.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const rows = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userId));
          const res = await ctx.app.request("http://localhost/api/export/retry", {
            body: JSON.stringify({ historyId: rows[0].id }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          expect(res.status).toBe(200);
        });
      });
    });
  });

  describe("WHEN a history row exists for the user", () => {
    describe("AND retry is posted", () => {
      describe("AND export_history rows are counted afterward", () => {
        it("shows two rows", async () => {
          const created = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "z", title: "Z" },
            userId: ctx.userId,
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [created.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const rows = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userId));
          await ctx.app.request("http://localhost/api/export/retry", {
            body: JSON.stringify({ historyId: rows[0].id }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const after = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userId));
          expect(after.length).toBe(2);
        });
      });
    });
  });
});

describe("POST /api/export/retry cross-user", () => {
  let ctx: TwoUserExportContext;

  beforeEach(async () => {
    ctx = await openTwoUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN user A owns an export history entry", () => {
    describe("AND user B posts retry with that history id", () => {
      describe("AND the response status is checked", () => {
        it("returns 404", async () => {
          const pa = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "a", title: "A" },
            userId: ctx.userA,
          });
          await ctx.appA.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [pa.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const rows = await ctx.database
            .select()
            .from(exportHistory)
            .where(eq(exportHistory.userId, ctx.userA));
          const res = await ctx.appB.request("http://localhost/api/export/retry", {
            body: JSON.stringify({ historyId: rows[0].id }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          expect(res.status).toBe(404);
        });
      });
    });
  });
});
