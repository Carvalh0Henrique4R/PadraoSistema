import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { and, eq } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { systemLogs } from "~/db/schema/system_logs";
import { importPatternsForUser } from "~/modules/patterns/import/patterns.import.actions";
import {
  createPatternForUser,
  deletePatternForUser,
  updatePatternForUser,
} from "~/modules/patterns/patterns.actions";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";

const seedInput = {
  category: "log-int-cat",
  content: "log-int-content",
  title: "Log Int Title",
} as const;

describe("systemLogsPatternsIntegration", () => {
  let client: SQL;
  let db: AppDb;
  let userId: string;

  beforeEach(async () => {
    const opened = await openTestDatabase();
    client = opened.client;
    db = opened.db;
    userId = await insertTestUser(db);
  });

  afterEach(async () => {
    await deleteUserCascadePatterns({ database: db, userId });
    await closeTestDatabase(client);
  });

  describe("WHEN a pattern is created", () => {
    describe("AND logs are filtered by CREATE_PATTERN", () => {
      it("lists one row", async () => {
        await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "CREATE_PATTERN")));
        expect(rows.length).toBe(1);
      });
    });
  });

  describe("WHEN a pattern is updated without content changes", () => {
    describe("AND the UPDATE_PATTERN log metadata is read", () => {
      it("marks unchanged", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        await updatePatternForUser({
          database: db,
          id: created.id,
          input: { ...seedInput },
          userId,
        });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "UPDATE_PATTERN")));
        expect(rows[0]?.metadata.unchanged).toBe(true);
      });
    });
  });

  describe("WHEN a pattern title is changed", () => {
    describe("AND logs are filtered by CREATE_VERSION", () => {
      it("lists one row", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        await updatePatternForUser({
          database: db,
          id: created.id,
          input: { ...seedInput, title: "Log Int Title Two" },
          userId,
        });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "CREATE_VERSION")));
        expect(rows.length).toBe(1);
      });
    });
  });

  describe("WHEN a versioned update completes", () => {
    describe("AND the UPDATE_PATTERN log metadata is read", () => {
      it("records version two", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        await updatePatternForUser({
          database: db,
          id: created.id,
          input: { ...seedInput, title: "Log Int Title Two" },
          userId,
        });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "UPDATE_PATTERN")));
        expect(rows[0]?.metadata.version).toBe(2);
      });
    });
  });

  describe("WHEN a pattern is deleted", () => {
    describe("AND logs are filtered by DELETE_PATTERN", () => {
      it("lists one row", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        await deletePatternForUser({ database: db, id: created.id, userId });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "DELETE_PATTERN")));
        expect(rows.length).toBe(1);
      });
    });
  });

  describe("WHEN a valid import body is processed", () => {
    describe("AND logs are filtered by IMPORT_PATTERNS", () => {
      it("lists one row", async () => {
        await importPatternsForUser({
          body: {
            data: {
              category: "c",
              description: "d",
              status: "draft",
              title: "Imported",
            },
          },
          database: db,
          userId,
        });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "IMPORT_PATTERNS")));
        expect(rows.length).toBe(1);
      });
    });
  });
});
