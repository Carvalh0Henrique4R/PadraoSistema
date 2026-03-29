import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { tryCatchAsync } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { listExportHistoryEntries, recordExportHistory, reexportZipFromHistory } from "./export-history.actions";
import { ExportHistoryNotFoundError } from "./export-history.errors";

describe("reexportZipFromHistory", () => {
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

  describe("WHEN no history row matches the user and id", () => {
    describe("AND reexport is invoked", () => {
      it("rejects with ExportHistoryNotFoundError", async () => {
        const fakeId = "11111111-1111-4111-8111-111111111111";
        const [, err] = await tryCatchAsync(() =>
          reexportZipFromHistory({
            database: db,
            historyId: fakeId,
            userId,
          }),
        );
        expect(err instanceof ExportHistoryNotFoundError).toBe(true);
      });
    });
  });
});

describe("listExportHistoryEntries", () => {
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

  describe("WHEN the user has no history rows", () => {
    describe("AND entries are listed", () => {
      it("returns an empty array", async () => {
        const list = await listExportHistoryEntries({ database: db, userId });
        expect(list.length).toBe(0);
      });
    });
  });

  describe("WHEN one export references an existing pattern", () => {
    describe("AND entries are listed", () => {
      describe("AND the first pattern title is read", () => {
        it("matches the pattern row", async () => {
          const p = await createPatternForUser({
            database: db,
            input: { category: "apis", content: "c", title: "Doc Alpha" },
            userId,
          });
          await recordExportHistory({ database: db, patternIds: [p.id], userId });
          const list = await listExportHistoryEntries({ database: db, userId });
          expect(list[0].patterns[0].title).toBe("Doc Alpha");
        });
      });
    });
  });

  describe("WHEN history references a pattern id that does not exist", () => {
    describe("AND entries are listed", () => {
      describe("AND the first pattern title is read", () => {
        it("uses the unavailable placeholder", async () => {
          const missing = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
          await recordExportHistory({ database: db, patternIds: [missing], userId });
          const list = await listExportHistoryEntries({ database: db, userId });
          expect(list[0].patterns[0].title).toBe("Padrão indisponível");
        });
      });
    });
  });

  describe("WHEN two exports reference the same pattern", () => {
    describe("AND entries are listed", () => {
      describe("AND the list length is checked", () => {
        it("equals two", async () => {
          const p = await createPatternForUser({
            database: db,
            input: { category: "apis", content: "x", title: "Shared" },
            userId,
          });
          await recordExportHistory({ database: db, patternIds: [p.id], userId });
          await recordExportHistory({ database: db, patternIds: [p.id], userId });
          const list = await listExportHistoryEntries({ database: db, userId });
          expect(list.length).toBe(2);
        });
      });
    });
  });
});
