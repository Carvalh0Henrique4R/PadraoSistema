import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import { openSingleUserExportContext, type SingleUserExportContext } from "~/test/exportHistoryTestContext";
import {
  deleteUserCascadePatterns,
  insertTestUser,
} from "~/test/patternVersioningTestKit";

describe("POST /api/export", () => {
  let ctx: SingleUserExportContext;

  beforeEach(async () => {
    ctx = await openSingleUserExportContext();
  });

  afterEach(async () => {
    await ctx.after();
  });

  describe("WHEN patternIds is empty", () => {
    describe("AND the request is posted", () => {
      it("responds with status 400", async () => {
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        expect(res.status).toBe(400);
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND a valid export body is posted", () => {
      it("responds with status 200", async () => {
        const created = await createPatternForUser({
          database: ctx.database,
          input: { category: "apis", content: "x", title: "Doc" },
          userId: ctx.userId,
        });
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [created.id] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        expect(res.status).toBe(200);
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND a valid export succeeds", () => {
      it("sets Content-Type to application/zip", async () => {
        const created = await createPatternForUser({
          database: ctx.database,
          input: { category: "apis", content: "x", title: "Doc" },
          userId: ctx.userId,
        });
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [created.id] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const ct = res.headers.get("content-type") ?? "";
        expect(ct.includes("application/zip")).toBe(true);
      });
    });
  });

  describe("WHEN the user owns a pattern", () => {
    describe("AND a valid export succeeds", () => {
      it("sets Content-Disposition for attachment download", async () => {
        const created = await createPatternForUser({
          database: ctx.database,
          input: { category: "apis", content: "x", title: "Doc" },
          userId: ctx.userId,
        });
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [created.id] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const cd = res.headers.get("content-disposition") ?? "";
        const hasAttachment = cd.includes("attachment");
        const hasZipName = cd.includes("patterns.zip");
        expect(hasAttachment && hasZipName).toBe(true);
      });
    });
  });

  describe("WHEN the pattern id is unknown", () => {
    describe("AND the request is posted", () => {
      it("responds with status 400", async () => {
        const unknownId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [unknownId] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        expect(res.status).toBe(400);
      });
    });
  });

  describe("WHEN the pattern is owned by a different user than the session", () => {
    describe("AND the session user posts a valid export body", () => {
      it("responds with status 200", async () => {
        const ownerId = await insertTestUser(ctx.database);
        const created = await createPatternForUser({
          database: ctx.database,
          input: { category: "apis", content: "other", title: "Other user pattern" },
          userId: ownerId,
        });
        const res = await ctx.app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [created.id] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        expect(res.status).toBe(200);
        await deleteUserCascadePatterns({ database: ctx.database, userId: ownerId });
      });
    });
  });
});
