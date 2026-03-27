import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { raise } from "@padraosistema/lib";
import { createAuthConfig } from "~/auth/createAuthConfig";
import type { AppDb } from "~/db/index";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import type { AppVariables } from "~/types/app";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { registerExportRoutes } from "./export.controller";

describe("POST /api/export", () => {
  let client: SQL;
  let db: AppDb;
  let userId: string;
  let app: Hono<{ Variables: AppVariables }>;

  const injectUser: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
    c.set("user", { email: "export@test", id: userId, name: "Export" });
    await next();
  };

  beforeEach(async () => {
    const opened = await openTestDatabase();
    client = opened.client;
    db = opened.db;
    userId = await insertTestUser(db);
    const authConfig = createAuthConfig({
      appEnv: {
        AUTH_SECRET: Bun.env.AUTH_SECRET ?? raise("AUTH_SECRET"),
        ENVIRONMENT: "testing",
        FRONTEND_URL: "http://localhost:5173",
        GOOGLE_CLIENT_ID: Bun.env.GOOGLE_CLIENT_ID ?? raise("GOOGLE_CLIENT_ID"),
        GOOGLE_CLIENT_SECRET: Bun.env.GOOGLE_CLIENT_SECRET ?? raise("GOOGLE_CLIENT_SECRET"),
      },
      database: db,
      oauthEncryptionKey: undefined,
    });
    app = new Hono<{ Variables: AppVariables }>();
    app.use("*", async (c, next) => {
      c.set("authConfig", authConfig);
      c.set("db", db);
      await next();
    });
    const exportApp = new Hono<{ Variables: AppVariables }>();
    registerExportRoutes(exportApp, { authenticate: injectUser });
    app.route("/api/export", exportApp);
  });

  afterEach(async () => {
    await deleteUserCascadePatterns({ database: db, userId });
    await closeTestDatabase(client);
  });

  describe("WHEN patternIds is empty", () => {
    describe("AND the request is posted", () => {
      it("responds with status 400", async () => {
        const res = await app.request("http://localhost/api/export", {
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
          database: db,
          input: { category: "apis", content: "x", title: "Doc" },
          userId,
        });
        const res = await app.request("http://localhost/api/export", {
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
          database: db,
          input: { category: "apis", content: "x", title: "Doc" },
          userId,
        });
        const res = await app.request("http://localhost/api/export", {
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
          database: db,
          input: { category: "apis", content: "x", title: "Doc" },
          userId,
        });
        const res = await app.request("http://localhost/api/export", {
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
        const res = await app.request("http://localhost/api/export", {
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
        const ownerId = await insertTestUser(db);
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "other", title: "Other user pattern" },
          userId: ownerId,
        });
        const res = await app.request("http://localhost/api/export", {
          body: JSON.stringify({ patternIds: [created.id] }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        expect(res.status).toBe(200);
        await deleteUserCascadePatterns({ database: db, userId: ownerId });
      });
    });
  });
});
