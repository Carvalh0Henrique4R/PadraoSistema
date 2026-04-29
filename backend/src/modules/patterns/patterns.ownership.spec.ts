import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { tryCatchAsync } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import {
  createPatternForUser,
  deletePatternForUser,
  getPatternForApi,
  updatePatternForUser,
} from "~/modules/patterns/patterns.actions";
import { PatternForbiddenError } from "~/modules/patterns/patterns.errors";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";

describe("pattern ownership (edit / delete)", () => {
  let client: SQL;
  let db: AppDb;
  let userAId: string;
  let userBId: string;

  beforeEach(async () => {
    const opened = await openTestDatabase();
    client = opened.client;
    db = opened.db;
    userAId = await insertTestUser(db);
    userBId = await insertTestUser(db);
  });

  afterEach(async () => {
    await deleteUserCascadePatterns({ database: db, userId: userAId });
    await deleteUserCascadePatterns({ database: db, userId: userBId });
    await closeTestDatabase(client);
  });

  describe("WHEN user A creates a pattern", () => {
    describe("AND any client loads it by id", () => {
      it("returns the pattern", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "visible", title: "Public read" },
          userId: userAId,
        });
        const loaded = await getPatternForApi(db, created.id);
        expect(loaded.title).toBe("Public read");
      });
    });

    describe("AND user B attempts to update it", () => {
      it("rejects with PatternForbiddenError", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "c", title: "Owned by A" },
          userId: userAId,
        });
        const [, err] = await tryCatchAsync(() =>
          updatePatternForUser({
            database: db,
            id: created.id,
            input: { category: "apis", content: "hacked", title: "H" },
            userId: userBId,
          }),
        );
        expect(err instanceof PatternForbiddenError).toBe(true);
      });
    });

    describe("AND user B attempts to delete it", () => {
      it("rejects with PatternForbiddenError", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { category: "apis", content: "c", title: "Owned by A" },
          userId: userAId,
        });
        const [, err] = await tryCatchAsync(() =>
          deletePatternForUser({ database: db, id: created.id, userId: userBId }),
        );
        expect(err instanceof PatternForbiddenError).toBe(true);
      });
    });
  });
});
