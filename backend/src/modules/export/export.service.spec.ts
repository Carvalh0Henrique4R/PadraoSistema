import { describe, expect, it } from "bun:test";
import type { PatternRow } from "~/modules/patterns/patterns.service";
import {
  assignMdcFilenames,
  buildMdcForCategory,
  categoryDisplayTitle,
  sanitizeCategoryBasename,
} from "./export.service";

const sampleRow = (params: { category: string; content: string; id: string; title: string }): PatternRow => ({
  category: params.category,
  content: params.content,
  createdAt: new Date(0),
  id: params.id,
  status: "draft",
  title: params.title,
  updatedAt: new Date(0),
  userId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  version: 1,
});

describe("sanitizeCategoryBasename", () => {
  describe("WHEN the category contains slashes", () => {
    describe("AND the value is sanitized", () => {
      it("replaces slashes with hyphens", () => {
        const result = sanitizeCategoryBasename("a/b");
        expect(result.includes("-")).toBe(true);
      });
    });
  });
});

describe("categoryDisplayTitle", () => {
  describe("WHEN the category slug is apis", () => {
    describe("AND the title is resolved", () => {
      it("returns APIs", () => {
        expect(categoryDisplayTitle("apis")).toBe("APIs");
      });
    });
  });
});

describe("buildMdcForCategory", () => {
  describe("WHEN one pattern exists in apis", () => {
    describe("AND the file body is built", () => {
      it("contains a pattern heading line", () => {
        const row = sampleRow({
          category: "apis",
          content: "x",
          id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          title: "T1",
        });
        const body = buildMdcForCategory({ categoryKey: "apis", rowsInOrder: [row] });
        expect(body.includes("## Pattern: T1")).toBe(true);
      });
    });
  });

  describe("WHEN one pattern exists in dados", () => {
    describe("AND the file body is built", () => {
      it("contains a section delimiter", () => {
        const row = sampleRow({
          category: "dados",
          content: "c",
          id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          title: "T2",
        });
        const body = buildMdcForCategory({ categoryKey: "dados", rowsInOrder: [row] });
        expect(body.includes("---")).toBe(true);
      });
    });
  });
});

describe("assignMdcFilenames", () => {
  describe("WHEN two categories sanitize to the same basename", () => {
    describe("AND the second filename is read", () => {
      it("ends with the mdc extension", () => {
        const map = assignMdcFilenames(["a/b", "a-b"]);
        const second = map.get("a-b") ?? "";
        expect(second.endsWith(".mdc")).toBe(true);
      });
    });
  });

  describe("WHEN two categories sanitize to the same basename", () => {
    describe("AND both filenames are compared", () => {
      it("produces distinct paths for each category key", () => {
        const map = assignMdcFilenames(["a/b", "a-b"]);
        const first = map.get("a/b") ?? "";
        const second = map.get("a-b") ?? "";
        expect(first === second).toBe(false);
      });
    });
  });
});
