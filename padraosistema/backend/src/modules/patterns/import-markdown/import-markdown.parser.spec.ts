import { describe, expect, it } from "bun:test";
import { parseMarkdownPatternFile } from "./import-markdown.parser";

describe("parseMarkdownPatternFile", () => {
  describe("WHEN the text has no front matter delimiter", () => {
    describe("AND defaultTitle is doc", () => {
      it("uses the full text as content", () => {
        const result = parseMarkdownPatternFile({ defaultTitle: "doc", rawText: "# Hello\n" });
        expect(result.content).toBe("# Hello\n");
      });
    });

    describe("AND defaultTitle is doc", () => {
      it("sets title to defaultTitle", () => {
        const result = parseMarkdownPatternFile({ defaultTitle: "doc", rawText: "body" });
        expect(result.title).toBe("doc");
      });
    });

    describe("AND defaults apply", () => {
      it("sets category to Importado", () => {
        const result = parseMarkdownPatternFile({ defaultTitle: "x", rawText: "y" });
        expect(result.category).toBe("Importado");
      });
    });

    describe("AND defaults apply", () => {
      it("sets status to draft", () => {
        const result = parseMarkdownPatternFile({ defaultTitle: "x", rawText: "y" });
        expect(result.status).toBe("draft");
      });
    });
  });

  describe("WHEN the text starts with front matter and closes", () => {
    describe("AND metadata overrides title category and status", () => {
      it("reads title from front matter", () => {
        const raw = "---\ntitle: API Guide\ncategory: apis\nstatus: estavel\n---\n# Body\n";
        const result = parseMarkdownPatternFile({ defaultTitle: "file", rawText: raw });
        expect(result.title).toBe("API Guide");
      });
    });

    describe("AND metadata overrides title category and status", () => {
      it("reads category from front matter", () => {
        const raw = "---\ntitle: API Guide\ncategory: apis\nstatus: estavel\n---\n# Body\n";
        const result = parseMarkdownPatternFile({ defaultTitle: "file", rawText: raw });
        expect(result.category).toBe("apis");
      });
    });

    describe("AND metadata overrides title category and status", () => {
      it("reads status from front matter", () => {
        const raw = "---\ntitle: API Guide\ncategory: apis\nstatus: estavel\n---\n# Body\n";
        const result = parseMarkdownPatternFile({ defaultTitle: "file", rawText: raw });
        expect(result.status).toBe("estavel");
      });
    });

    describe("AND body follows the closing delimiter", () => {
      it("strips front matter from content", () => {
        const raw = "---\ntitle: T\ncategory: c\nstatus: draft\n---\n# Body\n";
        const result = parseMarkdownPatternFile({ defaultTitle: "f", rawText: raw });
        expect(result.content).toBe("# Body\n");
      });
    });
  });

  describe("WHEN opening delimiter exists without closing", () => {
    describe("AND the file is treated as plain markdown", () => {
      it("keeps the entire string as content", () => {
        const raw = "---\ntitle: orphan\nstill no close";
        const result = parseMarkdownPatternFile({ defaultTitle: "nm", rawText: raw });
        expect(result.content).toBe(raw);
      });
    });

    describe("AND the file is treated as plain markdown", () => {
      it("does not apply front matter fields", () => {
        const raw = "---\ntitle: orphan\nnope";
        const result = parseMarkdownPatternFile({ defaultTitle: "nm", rawText: raw });
        expect(result.title).toBe("nm");
      });
    });
  });

  describe("WHEN front matter has empty title line", () => {
    describe("AND defaultTitle is fallback-name", () => {
      it("uses defaultTitle as title", () => {
        const raw = "---\ntitle:  \ncategory: X\nstatus: draft\n---\nHi";
        const result = parseMarkdownPatternFile({ defaultTitle: "fallback-name", rawText: raw });
        expect(result.title).toBe("fallback-name");
      });
    });
  });
});
