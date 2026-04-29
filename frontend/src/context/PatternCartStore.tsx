import {
  addItem as addItemToState,
  clearPatternCart,
  createEmptyPatternCart,
  removeItem as removeItemFromState,
  tryCatch,
  type PatternCartState,
} from "@padraosistema/lib";
import React from "react";
import { z } from "zod";
import { PatternCartContext, type PatternCartContextValue } from "./PatternCartContext";

const itemsStoredSchema = z.object({
  items: z.array(z.string()),
});

const legacyStoredSchema = z.object({
  patternIds: z.array(z.string()),
});

const cartStorageKey = (userId: string): string => {
  return `cart_${userId}`;
};

const parseStored = (raw: string | null): PatternCartState => {
  if (raw == null) {
    return createEmptyPatternCart();
  }
  const [parsed, parseErr] = tryCatch((): unknown => JSON.parse(raw));
  if (parseErr != null) {
    return createEmptyPatternCart();
  }
  const itemsChecked = itemsStoredSchema.safeParse(parsed);
  if (itemsChecked.success) {
    return { items: [...itemsChecked.data.items] };
  }
  const legacyChecked = legacyStoredSchema.safeParse(parsed);
  if (legacyChecked.success) {
    return { items: [...legacyChecked.data.patternIds] };
  }
  return createEmptyPatternCart();
};

const readInitialForUser = (userId: string | undefined): PatternCartState => {
  if (userId == null || typeof window === "undefined") {
    return createEmptyPatternCart();
  }
  return parseStored(window.localStorage.getItem(cartStorageKey(userId)));
};

type StoreProps = {
  children: React.ReactNode;
  userId: string | undefined;
};

export const PatternCartStore: React.FC<StoreProps> = ({ children, userId }) => {
  const [state, setState] = React.useState<PatternCartState>(() => readInitialForUser(userId));
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (userId == null || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(cartStorageKey(userId), JSON.stringify({ items: [...state.items] }));
  }, [userId, state.items]);

  const addItem = React.useCallback((id: string): void => {
    setState((prev) => addItemToState(prev, id));
  }, []);

  const removeItem = React.useCallback((id: string): void => {
    setState((prev) => removeItemFromState(prev, id));
  }, []);

  const clearCart = React.useCallback((): void => {
    setState(clearPatternCart());
  }, []);

  const openDrawer = React.useCallback((): void => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = React.useCallback((): void => {
    setDrawerOpen(false);
  }, []);

  const isInCart = React.useCallback(
    (id: string): boolean => {
      return state.items.includes(id);
    },
    [state.items],
  );

  const value = React.useMemo(
    (): PatternCartContextValue => ({
      addItem,
      clearCart,
      closeDrawer,
      isDrawerOpen,
      isInCart,
      items: state.items,
      openDrawer,
      removeItem,
    }),
    [addItem, clearCart, closeDrawer, isDrawerOpen, isInCart, openDrawer, removeItem, state.items],
  );

  return <PatternCartContext.Provider value={value}>{children}</PatternCartContext.Provider>;
};
