import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import type { AppDb } from "~/db/index";
import { createPatternForUser, getPatternForApi, updatePatternForUser } from "~/modules/patterns/patterns.actions";
import { randomUUID } from "node:crypto";
import { tryCatchAsync } from "@padraosistema/lib";
import {
  getPatternVersionForUser,
  listPatternVersionsForUser,
  revertPatternVersionForUser,
} from "./patternVersions.actions";
import { PatternVersionNotFoundError } from "./patternVersions.errors";
import { eq } from "drizzle-orm";
import { patternVersions } from "~/db/schema/pattern_versions";
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

  describe("WHEN a pattern at version 3 reverts using archived version 1 snapshot id", () => {
    let patternId: string;
    let versionOneSnapshotId: string;

    beforeEach(async () => {
      const created = await createPatternForUser({
        database: db,
        input: { ...seedInput, content: "content-v1", title: "V1" },
        userId,
      });
      patternId = created.id;
      await updatePatternForUser({
        database: db,
        id: patternId,
        input: { ...seedInput, content: "content-v2", title: "V2" },
        userId,
      });
      await updatePatternForUser({
        database: db,
        id: patternId,
        input: { ...seedInput, content: "content-v3", title: "V3" },
        userId,
      });
      const list = await listPatternVersionsForUser({
        database: db,
        patternId,
        userId,
      });
      const v1 = list.find((item) => item.version === 1);
      if (v1 == null) {
        throw new Error("missing v1 snapshot");
      }
      versionOneSnapshotId = v1.id;
    });

    describe("AND revert completes", () => {
      describe("AND the live pattern is loaded", () => {
        it("exposes version 4", async () => {
          await revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: versionOneSnapshotId,
          });
          const row = await getPatternForApi(db, patternId);
          expect(row.version).toBe(4);
        });
      });
    });

    describe("AND revert completes", () => {
      describe("AND the live title is read", () => {
        it("equals the reverted snapshot title", async () => {
          await revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: versionOneSnapshotId,
          });
          const row = await getPatternForApi(db, patternId);
          expect(row.title).toBe("V1");
        });
      });
    });

    describe("AND revert completes", () => {
      describe("AND the live content is read", () => {
        it("equals the reverted snapshot content", async () => {
          await revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: versionOneSnapshotId,
          });
          const row = await getPatternForApi(db, patternId);
          expect(row.content).toBe("content-v1");
        });
      });
    });

    describe("AND revert completes", () => {
      describe("AND archived rows for the pattern are counted", () => {
        it("increases by exactly one", async () => {
          const beforeRows = await db.select().from(patternVersions).where(eq(patternVersions.patternId, patternId));
          await revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: versionOneSnapshotId,
          });
          const afterRows = await db.select().from(patternVersions).where(eq(patternVersions.patternId, patternId));
          expect(afterRows.length).toBe(beforeRows.length + 1);
        });
      });
    });

    describe("AND revert completes", () => {
      describe("AND archived version 1 is loaded by number", () => {
        it("keeps the original snapshot title", async () => {
          await revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: versionOneSnapshotId,
          });
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

    describe("AND revert is attempted with a random snapshot id", () => {
      it("rejects with version not found", async () => {
        const [, err] = await tryCatchAsync(() =>
          revertPatternVersionForUser({
            database: db,
            patternId,
            userId,
            versionSnapshotId: randomUUID(),
          }),
        );
        expect(err).toBeInstanceOf(PatternVersionNotFoundError);
      });
    });

    describe("AND another user pattern exists at version 3", () => {
      let otherPatternVersionOneSnapshotId: string;

      beforeEach(async () => {
        const other = await createPatternForUser({
          database: db,
          input: { ...seedInput, title: "Other-V1" },
          userId,
        });
        await updatePatternForUser({
          database: db,
          id: other.id,
          input: { ...seedInput, title: "Other-V2" },
          userId,
        });
        await updatePatternForUser({
          database: db,
          id: other.id,
          input: { ...seedInput, title: "Other-V3" },
          userId,
        });
        const list = await listPatternVersionsForUser({
          database: db,
          patternId: other.id,
          userId,
        });
        const v1 = list.find((item) => item.version === 1);
        if (v1 == null) {
          throw new Error("missing other v1 snapshot");
        }
        otherPatternVersionOneSnapshotId = v1.id;
      });

      describe("AND revert targets the foreign snapshot id", () => {
        it("rejects with version not found", async () => {
          const [, err] = await tryCatchAsync(() =>
            revertPatternVersionForUser({
              database: db,
              patternId,
              userId,
              versionSnapshotId: otherPatternVersionOneSnapshotId,
            }),
          );
          expect(err).toBeInstanceOf(PatternVersionNotFoundError);
        });
      });
    });
  });
});
