import type { PatternCartState } from "../types/export";

export const createEmptyPatternCart = (): PatternCartState => {
  return { items: [] };
};

export const addItem = (state: PatternCartState, id: string): PatternCartState => {
  if (state.items.includes(id)) {
    return state;
  }
  return { items: [...state.items, id] };
};

export const removeItem = (state: PatternCartState, id: string): PatternCartState => {
  return { items: state.items.filter((existing) => existing !== id) };
};

export const clearPatternCart = (): PatternCartState => {
  return { items: [] };
};

export const getItems = (state: PatternCartState): readonly string[] => {
  return state.items;
};
