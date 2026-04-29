import React from "react";
import { runCartZipExport } from "~/api/cartZipExport";

type Options = {
  clearCart: () => void;
  extraOnSuccess: (() => void) | undefined;
  itemIds: readonly string[];
  showSuccess: (message: string) => void;
};

export const usePatternCartZipExport = ({
  clearCart,
  extraOnSuccess,
  itemIds,
  showSuccess,
}: Options): {
  exportError: string | null;
  handleExportClick: () => void;
} => {
  const [exportError, setExportError] = React.useState<string | null>(null);

  const runExport = React.useCallback(async (): Promise<void> => {
    setExportError(null);
    if (itemIds.length === 0) {
      setExportError("O carrinho está vazio.");
      return;
    }
    const message = await runCartZipExport({
      itemIds: [...itemIds],
      onAfterSuccess: () => {
        clearCart();
        extraOnSuccess?.();
        showSuccess("Exportação concluída");
      },
    });
    if (message != null) {
      setExportError(message);
    }
  }, [clearCart, extraOnSuccess, itemIds, showSuccess]);

  const handleExportClick = React.useCallback((): void => {
    void runExport();
  }, [runExport]);

  return { exportError, handleExportClick };
};
