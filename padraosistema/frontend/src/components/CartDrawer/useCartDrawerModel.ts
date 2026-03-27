import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { usePatternsQuery } from "~/api/patterns.hooks";
import { useFlashMessage } from "~/context/FlashMessageContext";
import { useCart } from "~/hooks/useCart";
import { usePatternCartZipExport } from "~/hooks/usePatternCartZipExport";

export type CartDrawerModel = {
  exportError: string | null;
  handleBackdropClick: () => void;
  handleCloseClick: () => void;
  handleExportClick: () => void;
  handlePanelClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDrawerOpen: boolean;
  items: readonly string[];
  patternById: Map<string, Pattern>;
  removeItem: (id: string) => void;
};

export const useCartDrawerModel = (): CartDrawerModel => {
  const { clearCart, closeDrawer, isDrawerOpen, items, removeItem } = useCart();
  const { data: patterns } = usePatternsQuery();
  const { showSuccess } = useFlashMessage();

  const patternById = React.useMemo(() => {
    const list = patterns ?? [];
    return new Map(list.map((p: Pattern) => [p.id, p]));
  }, [patterns]);

  const { exportError, handleExportClick } = usePatternCartZipExport({
    clearCart,
    extraOnSuccess: closeDrawer,
    itemIds: items,
    showSuccess,
  });

  const handleBackdropClick = React.useCallback((): void => {
    closeDrawer();
  }, [closeDrawer]);

  const handlePanelClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  }, []);

  const handleCloseClick = React.useCallback((): void => {
    closeDrawer();
  }, [closeDrawer]);

  return {
    exportError,
    handleBackdropClick,
    handleCloseClick,
    handleExportClick,
    handlePanelClick,
    isDrawerOpen,
    items,
    patternById,
    removeItem,
  };
};
