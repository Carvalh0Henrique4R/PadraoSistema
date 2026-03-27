import React from "react";
import { useFlashMessage } from "~/context/FlashMessageContext";
import { useCart } from "~/hooks/useCart";
import { usePatternCartZipExport } from "~/hooks/usePatternCartZipExport";
import { useSession } from "~/hooks/useSession";

export const PadroesHeaderZipExport: React.FC = () => {
  const { status } = useSession();
  const { clearCart, items } = useCart();
  const { showSuccess } = useFlashMessage();

  const { exportError, handleExportClick } = usePatternCartZipExport({
    clearCart,
    extraOnSuccess: undefined,
    itemIds: items,
    showSuccess,
  });

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={items.length === 0}
        onClick={handleExportClick}
        className="rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Exportar ZIP
      </button>
      {exportError === null ? null : <span className="text-right text-xs text-red-400">{exportError}</span>}
    </div>
  );
};
