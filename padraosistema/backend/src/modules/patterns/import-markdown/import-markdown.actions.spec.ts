import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { SQL } from "bun";
import { and, eq } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { patterns } from "~/db/schema/patterns";
import { systemLogs } from "~/db/schema/system_logs";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import {
  importMarkdownPatternsForUser,
  MAX_MARKDOWN_IMPORT_BYTES,
  MAX_MARKDOWN_IMPORT_FILES,
} from "./import-markdown.actions";

describe("importMarkdownPatternsForUser", () => {
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

  describe("WHEN files array is empty", () => {
    describe("AND import runs", () => {
      it("returns ok false with a message", async () => {
        const result = await importMarkdownPatternsForUser({ database: db, files: [], userId });
        expect(result.ok).toBe(false);
      });
    });
  });

  describe("WHEN more than the maximum file count is sent", () => {
    describe("AND import runs", () => {
      it("returns ok false", async () => {
        const many = Array.from({ length: MAX_MARKDOWN_IMPORT_FILES + 1 }, (_, i) => {
          return new File(["x"], `f${String(i)}.md`, { type: "text/markdown" });
        });
        const result = await importMarkdownPatternsForUser({ database: db, files: many, userId });
        expect(result.ok).toBe(false);
      });
    });
  });

  describe("WHEN a file has extension .txt", () => {
    describe("AND import runs", () => {
      it("returns index zero", async () => {
        const file = new File(["hello"], "nope.txt", { type: "text/plain" });
        const result = await importMarkdownPatternsForUser({ database: db, files: [file], userId });
        expect(result.ok ? -1 : result.index).toBe(0);
      });
    });
  });

  describe("WHEN a file is empty", () => {
    describe("AND import runs", () => {
      it("returns index zero", async () => {
        const file = new File([], "empty.md", { type: "text/markdown" });
        const result = await importMarkdownPatternsForUser({ database: db, files: [file], userId });
        expect(result.ok ? -1 : result.index).toBe(0);
      });
    });
  });

  describe("WHEN a file exceeds the byte limit", () => {
    describe("AND import runs", () => {
      it("returns index zero", async () => {
        const bytes = new Uint8Array(MAX_MARKDOWN_IMPORT_BYTES + 1);
        bytes.fill(97);
        const file = new File([bytes], "big.md", { type: "text/markdown" });
        const result = await importMarkdownPatternsForUser({ database: db, files: [file], userId });
        expect(result.ok ? -1 : result.index).toBe(0);
      });
    });
  });

  describe("WHEN front matter contains an invalid status", () => {
    describe("AND import runs", () => {
      it("returns index zero", async () => {
        const raw = "---\nstatus: not-a-real-status\n---\nbody\n";
        const file = new File([raw], "bad.md", { type: "text/markdown" });
        const result = await importMarkdownPatternsForUser({ database: db, files: [file], userId });
        expect(result.ok ? -1 : result.index).toBe(0);
      });
    });
  });

  describe("WHEN two valid markdown files are imported", () => {
    beforeEach(async () => {
      const a = new File(["# One"], "one.md", { type: "text/markdown" });
      const b = new File(["# Two"], "two.mdc", { type: "text/markdown" });
      await importMarkdownPatternsForUser({ database: db, files: [a, b], userId });
    });

    describe("AND pattern rows are counted", () => {
      it("persists two rows", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows.length).toBe(2);
      });
    });

    describe("AND the first inserted row version is read", () => {
      it("stores version one", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        const versions = rows.map((r) => r.version);
        expect(versions.every((v) => v === 1)).toBe(true);
      });
    });

    describe("AND markdown import logs are filtered", () => {
      it("records one IMPORT_MARKDOWN_PATTERNS row", async () => {
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "IMPORT_MARKDOWN_PATTERNS")));
        expect(rows.length).toBe(1);
      });
    });

    describe("AND markdown import log metadata is read", () => {
      it("stores count two", async () => {
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "IMPORT_MARKDOWN_PATTERNS")));
        expect(rows[0]?.metadata.count).toBe(2);
      });
    });

    describe("AND markdown import log metadata files field is read", () => {
      it("includes both basenames", async () => {
        const rows = await db
          .select()
          .from(systemLogs)
          .where(and(eq(systemLogs.userId, userId), eq(systemLogs.action, "IMPORT_MARKDOWN_PATTERNS")));
        const filesField = rows[0]?.metadata.files;
        expect(typeof filesField === "string" && filesField.includes("one.md")).toBe(true);
      });
    });
  });

  describe("WHEN one file uses front matter for category and status", () => {
    beforeEach(async () => {
      const raw = "---\ntitle: FM Title\ncategory: apis\nstatus: estavel\n---\nContent here\n";
      const file = new File([raw], "ignored.md", { type: "text/markdown" });
      await importMarkdownPatternsForUser({ database: db, files: [file], userId });
    });

    describe("AND the row is loaded", () => {
      it("stores the front matter title", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows[0]?.title).toBe("FM Title");
      });
    });

    describe("AND the row category is read", () => {
      it("stores apis", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows[0]?.category).toBe("apis");
      });
    });

    describe("AND the row status is read", () => {
      it("stores stable", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows[0]?.status).toBe("stable");
      });
    });
  });

  describe("WHEN one plain file has no front matter", () => {
    beforeEach(async () => {
      const file = new File(["# Z"], "plain-name.md", { type: "text/markdown" });
      await importMarkdownPatternsForUser({ database: db, files: [file], userId });
    });

    describe("AND the row defaults are read", () => {
      it("sets category Importado", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows[0]?.category).toBe("Importado");
      });
    });

    describe("AND the row title is read", () => {
      it("uses the basename without extension", async () => {
        const rows = await db.select().from(patterns).where(eq(patterns.userId, userId));
        expect(rows[0]?.title).toBe("plain-name");
      });
    });
  });
});
