import React from "react";

export type PatternCartContextValue = {
  addItem: (id: string) => void;
  clearCart: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  isInCart: (id: string) => boolean;
  items: readonly string[];
  openDrawer: () => void;
  removeItem: (id: string) => void;
};

export const PatternCartContext = React.createContext<PatternCartContextValue | null>(null);
