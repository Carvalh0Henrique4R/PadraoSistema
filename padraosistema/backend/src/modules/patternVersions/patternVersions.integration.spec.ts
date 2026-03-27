import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import type { AppDb } from "~/db/index";
import {
  createPatternForUser,
  getPatternForApi,
  updatePatternForUser,
} from "~/modules/patterns/patterns.actions";
import { getPatternVersionForUser, listPatternVersionsForUser } from "./patternVersions.actions";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";

const seedInput = {
  category: "integration-cat",
  content: "integration-content",
  title: "Integration Title One",
} as const;

describe("patternVersioningIntegration", () => {
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

  describe("WHEN a pattern is created", () => {
    describe("AND create returns the pattern", () => {
      it("exposes version 1", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        expect(created.version).toBe(1);
      });
    });
  });

  describe("WHEN a pattern is updated once with a new title", () => {
    describe("AND the update returns the pattern", () => {
      it("exposes version 2", async () => {
        const created = await createPatternForUser({
          database: db,
          input: { ...seedInput },
          userId,
        });
        const updated = await updatePatternForUser({
          database: db,
          id: created.id,
          input: { ...seedInput, title: "Integration Title Two" },
          userId,
        });
        expect(updated.version).toBe(2);
      });
    });
  });

  describe("WHEN a pattern is updated once with a new title", () => {
    describe("AND archived versions are listed", () => {
      describe("AND the list has exactly one row", () => {
        it("returns length 1", async () => {
          const created = await createPatternForUser({
            database: db,
            input: { ...seedInput },
            userId,
          });
          await updatePatternForUser({
            database: db,
            id: created.id,
            input: { ...seedInput, title: "Integration Title Two" },
            userId,
          });
          const list = await listPatternVersionsForUser({
            database: db,
            patternId: created.id,
            userId,
          });
          expect(list.length).toBe(1);
        });
      });
    });
  });

  describe("WHEN a pattern is updated once with a new title", () => {
    describe("AND archived versions are listed", () => {
      describe("AND the sole row is inspected", () => {
        it("has version 1", async () => {
          const created = await createPatternForUser({
            database: db,
            input: { ...seedInput },
            userId,
          });
          await updatePatternForUser({
            database: db,
            id: created.id,
            input: { ...seedInput, title: "Integration Title Two" },
            userId,
          });
          const list = await listPatternVersionsForUser({
            database: db,
            patternId: created.id,
            userId,
          });
          expect(list[0]?.version).toBe(1);
        });
      });
    });
  });

  describe("WHEN a pattern received two title updates after creation", () => {
    let patternId: string;

    beforeEach(async () => {
      const created = await createPatternForUser({
        database: db,
        input: { ...seedInput, title: "V1" },
        userId,
      });
      patternId = created.id;
      await updatePatternForUser({
        database: db,
        id: patternId,
        input: { ...seedInput, title: "V2" },
        userId,
      });
      await updatePatternForUser({
        database: db,
        id: patternId,
        input: { ...seedInput, title: "V3" },
        userId,
      });
    });

    describe("AND the live pattern is loaded", () => {
      it("exposes version 3", async () => {
        const row = await getPatternForApi(db, patternId);
        expect(row.version).toBe(3);
      });
    });

    describe("AND archived versions are listed in descending order", () => {
      describe("AND the first listed row is inspected", () => {
        it("has version 2", async () => {
          const list = await listPatternVersionsForUser({
            database: db,
            patternId,
            userId,
          });
          expect(list[0]?.version).toBe(2);
        });
      });
    });

    describe("AND archived versions are listed in descending order", () => {
      describe("AND the second listed row is inspected", () => {
        it("has version 1", async () => {
          const list = await listPatternVersionsForUser({
            database: db,
            patternId,
            userId,
          });
          expect(list[1]?.version).toBe(1);
        });
      });
    });

    describe("AND version 1 is loaded by number", () => {
      describe("AND the snapshot title is read", () => {
        it("equals the original title", async () => {
          const detail = await getPatternVersionForUser({
            database: db,
            patternId,
            userId,
            version: 1,
          });
          expect(detail.title).toBe("V1");
        });
      });
    });
  });
});
