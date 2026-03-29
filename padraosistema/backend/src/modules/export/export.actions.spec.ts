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
import { exportPatternsZip, normalizeExportPatternIds } from "./export.actions";
import { ExportPatternsInvalidSelectionError } from "./export.errors";

describe("exportPatternsZip", () => {
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

  describe("WHEN the user owns a pattern", () => {
    describe("AND that id is exported", () => {
      it("returns a non-empty byte sequence", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "c", title: "T" },
          userId,
        });
        const bytes = await exportPatternsZip({
          database: db,
          patternIds: [created.id],
        });
        expect(bytes.length > 10).toBe(true);
      });
    });
  });

  describe("WHEN the pattern id does not exist", () => {
    describe("AND export is requested", () => {
      it("rejects with ExportPatternsInvalidSelectionError", async () => {
        const missingId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
        const [, err] = await tryCatchAsync(() =>
          exportPatternsZip({
            database: db,
            patternIds: [missingId],
          }),
        );
        expect(err instanceof ExportPatternsInvalidSelectionError).toBe(true);
      });
    });
  });

  describe("WHEN the pattern is owned by another user", () => {
    describe("AND export is requested without ownership check", () => {
      it("returns a non-empty byte sequence", async () => {
        const ownerId = await insertTestUser(db);
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "shared", title: "Shared" },
          userId: ownerId,
        });
        const bytes = await exportPatternsZip({
          database: db,
          patternIds: [created.id],
        });
        expect(bytes.length > 10).toBe(true);
        await deleteUserCascadePatterns({ database: db, userId: ownerId });
      });
    });
  });
});

describe("normalizeExportPatternIds", () => {
  describe("WHEN duplicate ids appear in the input", () => {
    describe("AND normalization runs", () => {
      it("keeps first-seen order without duplicates", () => {
        const a = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
        const b = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
        const out = normalizeExportPatternIds([a, b, a]);
        expect(out).toEqual([a, b]);
      });
    });
  });
});
