import { describe, expect, it } from "bun:test";
import { PatternForbiddenError, PatternNotFoundError } from "./patterns.errors";

describe("PatternNotFoundError", () => {
  describe("WHEN constructed", () => {
    describe("AND reading name", () => {
      it("returns PatternNotFoundError", () => {
        expect(new PatternNotFoundError().name).toBe("PatternNotFoundError");
      });
    });
  });
});

describe("PatternForbiddenError", () => {
  describe("WHEN constructed", () => {
    describe("AND reading name", () => {
      it("returns PatternForbiddenError", () => {
        expect(new PatternForbiddenError().name).toBe("PatternForbiddenError");
      });
    });
  });
});
