import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import type { AppDb } from "~/db/index";
import { createPatternForUser } from "~/modules/patterns/patterns.actions";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import { exportPatternsZip } from "./export.actions";

const bufferContainsUtf8String = (haystack: Uint8Array, needle: string): boolean => {
  const encoded = new TextEncoder().encode(needle);
  if (encoded.length === 0) {
    return true;
  }
  if (encoded.length > haystack.length) {
    return false;
  }
  const lastStart = haystack.length - encoded.length;
  const matchAt = (start: number): boolean => encoded.every((byte, index) => haystack[start + index] === byte);
  const indices = Array.from({ length: lastStart + 1 }, (_, index) => index);
  return indices.some(matchAt);
};

describe("exportZipIntegration", () => {
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

  describe("WHEN two patterns use different categories", () => {
    describe("AND both ids are exported", () => {
      it("embeds both mdc filenames in the zip bytes", async () => {
        const a = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "ca", title: "A" },
          userId,
        });
        const b = await createPatternForUser({
          database: db,
          input: { category: "dados", content: "cb", title: "B" },
          userId,
        });
        const bytes = await exportPatternsZip({
          database: db,
          patternIds: [a.id, b.id],
        });
        const hasApis = bufferContainsUtf8String(bytes, "apis.mdc");
        expect(hasApis).toBe(true);
      });
    });
  });

  describe("WHEN two patterns use different categories", () => {
    describe("AND both ids are exported", () => {
      it("embeds the dados mdc filename in the zip bytes", async () => {
        const a = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "ca", title: "A" },
          userId,
        });
        const b = await createPatternForUser({
          database: db,
          input: { category: "dados", content: "cb", title: "B" },
          userId,
        });
        const bytes = await exportPatternsZip({
          database: db,
          patternIds: [a.id, b.id],
        });
        const hasDados = bufferContainsUtf8String(bytes, "dados.mdc");
        expect(hasDados).toBe(true);
      });
    });
  });
});
