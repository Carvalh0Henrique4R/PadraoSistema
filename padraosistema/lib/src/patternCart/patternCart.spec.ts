import { describe, expect, it } from "bun:test";
import { addItem, clearPatternCart, createEmptyPatternCart, getItems, removeItem } from "./patternCart";

const sampleId = "550e8400-e29b-41d4-a716-446655440000";

describe("addItem", () => {
  describe("WHEN the cart is empty", () => {
    describe("AND an id is added", () => {
      it("returns a cart containing that id", () => {
        const next = addItem(createEmptyPatternCart(), sampleId);
        expect(getItems(next).length).toBe(1);
      });
    });
  });

  describe("WHEN the id is already in the cart", () => {
    describe("AND the same id is added again", () => {
      it("returns the same reference", () => {
        const before = addItem(createEmptyPatternCart(), sampleId);
        const after = addItem(before, sampleId);
        expect(after).toBe(before);
      });
    });
  });
});

describe("removeItem", () => {
  describe("WHEN the cart has one id", () => {
    describe("AND that id is removed", () => {
      it("returns an empty cart", () => {
        const withId = addItem(createEmptyPatternCart(), sampleId);
        const next = removeItem(withId, sampleId);
        expect(getItems(next).length).toBe(0);
      });
    });
  });
});

describe("clearPatternCart", () => {
  describe("WHEN clear is called", () => {
    describe("AND the result is inspected", () => {
      it("returns an empty item list", () => {
        const cleared = clearPatternCart();
        expect(getItems(cleared).length).toBe(0);
      });
    });
  });
});
