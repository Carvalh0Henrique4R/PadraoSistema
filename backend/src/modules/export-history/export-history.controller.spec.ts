import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import {
  openSingleUserExportContext,
  openTwoUserExportContext,
  type SingleUserExportContext,
  type TwoUserExportContext,
} from "~/test/exportHistoryTestContext";

describe("GET /api/export/history", () => {
  let ctx: SingleUserExportContext;

  beforeEach(async () => {
    ctx = await openSingleUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN the user has no exports", () => {
    describe("AND history is requested", () => {
      describe("AND the status is checked", () => {
        it("returns 200", async () => {
          const res = await ctx.app.request("http://localhost/api/export/history", { method: "GET" });
          expect(res.status).toBe(200);
        });
      });
    });
  });

  describe("WHEN the user has no exports", () => {
    describe("AND history is requested", () => {
      describe("AND the body is parsed as json", () => {
        it("yields an empty array", async () => {
          const res = await ctx.app.request("http://localhost/api/export/history", { method: "GET" });
          const body = JSON.parse(await res.text()) as unknown;
          expect(Array.isArray(body) && body.length === 0).toBe(true);
        });
      });
    });
  });

  describe("WHEN two exports are created in sequence", () => {
    describe("AND history is requested", () => {
      describe("AND the first list item is inspected", () => {
        it("matches the most recent pattern id", async () => {
          const first = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "a", title: "A" },
            userId: ctx.userId,
          });
          const second = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "b", title: "B" },
            userId: ctx.userId,
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [first.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          await ctx.app.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [second.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const res = await ctx.app.request("http://localhost/api/export/history", { method: "GET" });
          const list = JSON.parse(await res.text()) as { patterns: { id: string }[] }[];
          expect(list[0].patterns[0].id).toBe(second.id);
        });
      });
    });
  });
});

describe("GET /api/export/history isolation", () => {
  let ctx: TwoUserExportContext;

  beforeEach(async () => {
    ctx = await openTwoUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN each user performed one export", () => {
    describe("AND user A fetches history", () => {
      describe("AND the returned list length is checked", () => {
        it("equals one", async () => {
          const pa = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "a", title: "A" },
            userId: ctx.userA,
          });
          const pb = await createPatternForUser({
            database: ctx.database,
            input: { category: "apis", content: "b", title: "B" },
            userId: ctx.userB,
          });
          await ctx.appA.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [pa.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          await ctx.appB.request("http://localhost/api/export", {
            body: JSON.stringify({ patternIds: [pb.id] }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });
          const res = await ctx.appA.request("http://localhost/api/export/history", { method: "GET" });
          const list = JSON.parse(await res.text()) as unknown[];
          expect(list.length).toBe(1);
        });
      });
    });
  });
});
