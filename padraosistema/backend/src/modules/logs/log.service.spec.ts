import { describe, expect, it } from "bun:test";
import { tryCatchAsync } from "@padraosistema/lib";
import { runSafeAsyncSideEffect } from "./log.service";

describe("runSafeAsyncSideEffect", () => {
  describe("WHEN the callback rejects with an Error", () => {
    describe("AND the outer tryCatchAsync result is inspected", () => {
      it("has a null error slot", async () => {
        const [, err] = await tryCatchAsync(() =>
          runSafeAsyncSideEffect(() => Promise.reject(new Error("log insert failed"))),
        );
        expect(err).toBeNull();
      });
    });
  });
});
