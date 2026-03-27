import React from "react";
import { PatternCartContext } from "~/context/PatternCartContext";

export const useCart = (): {
  addItem: (id: string) => void;
  clearCart: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  isInCart: (id: string) => boolean;
  items: readonly string[];
  openDrawer: () => void;
  removeItem: (id: string) => void;
} => {
  const ctx = React.useContext(PatternCartContext);
  if (ctx == null) {
    throw new Error("useCart must be used within PatternCartProvider");
  }
  return ctx;
};
