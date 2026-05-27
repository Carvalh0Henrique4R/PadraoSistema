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

const selectUserPatterns = async (db: AppDb, userId: string) => {
  return db.select().from(patterns).where(eq(patterns.userId, userId));
};

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
        data: [{ category: "apis", status: "draft", title: "t" }],
      });
      expect(result.ok ? -1 : result.index).toBe(0);
    });
  });

  describe("WHEN the second item has an unknown status token", () => {
    it("returns index one", () => {
      const result = parsePatternImportBody({
        data: [
          { category: "apis", description: "d", status: "draft", title: "t1" },
          { category: "apis", description: "d", status: "invalid-status-xyz", title: "t2" },
        ],
      });
      expect(result.ok ? -1 : result.index).toBe(1);
    });
  });

  describe("WHEN an item has an unknown category", () => {
    it("rejects the item", () => {
      const result = parsePatternImportBody({
        data: [{ category: "Arquitetura", description: "d", status: "draft", title: "t" }],
      });
      expect(result.ok).toBe(false);
      expect(result.ok ? "" : result.message).toBe("Categoria inválida para o padrão importado.");
    });
  });

  describe("WHEN an item uses a category label from the combo", () => {
    it("normalizes the category to the lowercase slug", () => {
      const result = parsePatternImportBody({
        data: [{ category: "Componentes", description: "d", status: "draft", title: "t" }],
      });
      expect(result.ok ? result.items[0]?.category : "").toBe("componentes");
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

  describe("WHEN a single object uses a Portuguese status alias and category label", () => {
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

    it("stores the category as the lowercase slug", async () => {
      const rows = await selectUserPatterns(db, userId);
      expect(rows[0]?.category).toBe("componentes");
    });
  });

  describe("WHEN two valid items are imported in one request", () => {
    let outcome: Awaited<ReturnType<typeof importPatternsForUser>>;

    beforeEach(async () => {
      outcome = await importPatternsForUser({
        body: {
          data: [
            { category: "APIs", description: "d1", status: "estavel", title: "P1" },
            { category: "dados", description: "d2", status: "review", title: "P2" },
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
      const prior = await selectUserPatterns(db, userId);
      rowCountBefore = prior.length;
      outcome = await importPatternsForUser({
        body: {
          data: [
            { category: "apis", description: "d", status: "draft", title: "ok" },
            { category: "apis", description: "d", status: "bad", title: "bad" },
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
        const after = await selectUserPatterns(db, userId);
        rowCountAfter = after.length;
      });

      it("does not insert any new patterns", () => {
        expect(rowCountAfter).toBe(rowCountBefore);
      });
    });
  });
});
