import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { eq } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { systemLogs } from "~/db/schema/system_logs";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { insertSystemLogRow } from "./log.repository";

describe("insertSystemLogRow", () => {
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

  describe("WHEN a row is inserted for the test user", () => {
    describe("AND system_logs is queried by user", () => {
      it("returns exactly one row", async () => {
        await insertSystemLogRow({
          action: "EXPORT_PATTERNS",
          database: db,
          entity: "export",
          entityId: null,
          metadata: { patternCount: 2 },
          userId,
        });
        const rows = await db.select().from(systemLogs).where(eq(systemLogs.userId, userId));
        expect(rows.length).toBe(1);
      });
    });
  });
});
