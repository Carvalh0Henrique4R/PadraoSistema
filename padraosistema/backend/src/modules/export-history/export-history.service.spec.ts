import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { eq } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { exportHistory } from "~/db/schema/export_history";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { insertExportHistoryRecord } from "./export-history.service";

describe("insertExportHistoryRecord from service", () => {
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

  describe("WHEN a row is inserted", () => {
    describe("AND export_history is queried for the user", () => {
      describe("AND the row count is evaluated", () => {
        it("equals one", async () => {
          const pid = "22222222-2222-4222-8222-222222222222";
          await insertExportHistoryRecord({
            database: db,
            patternIds: [pid],
            userId,
          });
          const rows = await db.select().from(exportHistory).where(eq(exportHistory.userId, userId));
          expect(rows.length).toBe(1);
        });
      });
    });
  });
});
