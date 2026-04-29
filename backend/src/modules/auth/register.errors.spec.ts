import { describe, expect, it } from "bun:test";
import { EmailTakenError } from "./register.errors";

describe("EmailTakenError", () => {
  describe("WHEN constructed", () => {
    describe("AND reading name", () => {
      it("returns EmailTakenError", () => {
        expect(new EmailTakenError().name).toBe("EmailTakenError");
      });
    });
  });
});
