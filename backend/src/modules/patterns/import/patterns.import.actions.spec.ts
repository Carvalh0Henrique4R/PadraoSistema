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
import { importPatternsForUser, parsePatternImportBody } from "./patterns.import.actions";

describe("parsePatternImportBody", () => {
  describe("WHEN the root object contains an unknown property", () => {
    it("rejects the payload", () => {
      const result = parsePatternImportBody({ data: {}, extra: true } as unknown);
      expect(result.ok).toBe(false);
    });
  });

  describe("WHEN data is a string", () => {
    it("rejects the payload", () => {
      const result = parsePatternImportBody({ data: "not-json-object" });
      expect(result.ok).toBe(false);
    });
  });

  describe("WHEN data is null", () => {
    it("rejects the payload", () => {
      const result = parsePatternImportBody({ data: null });
      expect(result.ok).toBe(false);
    });
  });

  describe("WHEN data is an empty array", () => {
    it("rejects the payload", () => {
      const result = parsePatternImportBody({ data: [] });
      expect(result.ok).toBe(false);
    });
  });

  describe("WHEN the first item omits description", () => {
    it("returns index zero", () => {
      const result = parsePatternImportBody({
        data: [{ category: "c", status: "draft", title: "t" }],
      });
      expect(result.ok ? -1 : result.index).toBe(0);
    });
  });

  describe("WHEN the second item has an unknown status token", () => {
    it("returns index one", () => {
      const result = parsePatternImportBody({
        data: [
          { category: "c", description: "d", status: "draft", title: "t1" },
          { category: "c", description: "d", status: "invalid-status-xyz", title: "t2" },
        ],
      });
      expect(result.ok ? -1 : result.index).toBe(1);
    });
  });
});

describe("importPatternsForUser", () => {
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

  describe("WHEN a single object uses a Portuguese status alias", () => {
    let outcome: Awaited<ReturnType<typeof importPatternsForUser>>;

    beforeEach(async () => {
      outcome = await importPatternsForUser({
        body: {
          data: {
            category: "Componentes",
            description: "Conteúdo",
            status: "rascunho",
            title: "Único",
          },
        },
        database: db,
        userId,
      });
    });

    it("returns success with one created pattern", () => {
      expect(outcome.ok && outcome.created === 1).toBe(true);
    });
  });

  describe("WHEN two valid items are imported in one request", () => {
    let outcome: Awaited<ReturnType<typeof importPatternsForUser>>;

    beforeEach(async () => {
      outcome = await importPatternsForUser({
        body: {
          data: [
            { category: "c", description: "d1", status: "estavel", title: "P1" },
            { category: "c", description: "d2", status: "review", title: "P2" },
          ],
        },
        database: db,
        userId,
      });
    });

    it("returns success with two created patterns", () => {
      expect(outcome.ok && outcome.created === 2).toBe(true);
    });
  });

  describe("WHEN the second item fails validation", () => {
    let rowCountBefore: number;
    let outcome: Awaited<ReturnType<typeof importPatternsForUser>>;

    beforeEach(async () => {
      const prior = await db.select().from(patterns).where(eq(patterns.userId, userId));
      rowCountBefore = prior.length;
      outcome = await importPatternsForUser({
        body: {
          data: [
            { category: "c", description: "d", status: "draft", title: "ok" },
            { category: "c", description: "d", status: "bad", title: "bad" },
          ],
        },
        database: db,
        userId,
      });
    });

    describe("AND the outcome is inspected", () => {
      it("reports failure", () => {
        expect(outcome.ok).toBe(false);
      });
    });

    describe("AND the database row count is compared", () => {
      let rowCountAfter: number;

      beforeEach(async () => {
        const after = await db.select().from(patterns).where(eq(patterns.userId, userId));
        rowCountAfter = after.length;
      });

      it("does not insert any new patterns", () => {
        expect(rowCountAfter).toBe(rowCountBefore);
      });
    });
  });
});
