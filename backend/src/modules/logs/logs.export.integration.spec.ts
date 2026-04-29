import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { and, eq } from "drizzle-orm";
import { raise } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { exportHistory } from "~/db/schema/export_history";
import { systemLogs } from "~/db/schema/system_logs";
import { recordExportHistory, reexportZipFromHistory } from "~/modules/export-history/export-history.actions";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";

describe("systemLogsExportIntegration", () => {
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

  describe("WHEN export history is recorded for a pattern", () => {
    describe("AND logs are filtered by EXPORT_PATTERNS", () => {
      it("lists one row", async () => {
        const p = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "c", title: "E" },
          userId,
        });
        await recordExportHistory({ database: db, patternIds: [p.id], userId });
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "EXPORT_PATTERNS")));
        expect(rows.length).toBe(1);
      });
    });
  });

  describe("WHEN a history row is reexported", () => {
    describe("AND logs are filtered by REEXPORT_PATTERNS", () => {
      it("lists one row", async () => {
        const p = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "c", title: "R" },
          userId,
        });
        await recordExportHistory({ database: db, patternIds: [p.id], userId });
        const priorExport = await db.select().from(exportHistory).where(eq(exportHistory.userId, userId));
        const historyId = priorExport[0]?.id ?? raise("missing export history row");
        await reexportZipFromHistory({
          database: db,
          historyId,
          userId,
        });
        const re = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "REEXPORT_PATTERNS")));
        expect(re.length).toBe(1);
      });
    });
  });
});
