import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { eq } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { patterns } from "~/db/schema/patterns";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { importPatternRowsInTransaction } from "./patterns.import.service";

describe("importPatternRowsInTransaction", () => {
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

  describe("WHEN two valid pattern inputs are supplied", () => {
    beforeEach(async () => {
      await importPatternRowsInTransaction({
        database: db,
        inputs: [
          { category: "apis", content: "c1", status: "draft", title: "S1" },
          { category: "apis", content: "c2", status: "stable", title: "S2" },
        ],
        userId,
      });
    });

    describe("AND rows are loaded for the user", () => {
      let rowCount: number;

      beforeEach(async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        rowCount = rows.length;
      });

      it("persists two pattern rows", () => {
        expect(rowCount).toBe(2);
      });
    });

    describe("AND the row titled S1 is selected", () => {
      let versionValue: number | undefined;

      beforeEach(async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        const match = rows.find((r) => r.title === "S1");
        versionValue = match?.version;
      });

      it("stores version one on the imported pattern", () => {
        expect(versionValue).toBe(1);
      });
    });

    describe("AND the row titled S1 is inspected for ownership", () => {
      let ownerId: string | undefined;

      beforeEach(async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        const match = rows.find((r) => r.title === "S1");
        ownerId = match?.userId;
      });

      it("assigns the authenticated user id", () => {
        expect(ownerId).toBe(userId);
      });
    });
  });
});
