import React from "react";
import { ImportModalOpenBody } from "./ImportModalOpenBody";
import { useImportModalController } from "./useImportModalController";

type Props = {
  onClose: () => void;
  open: boolean;
};

export const ImportModal: React.FC<Props> = ({ onClose, open }) => {
  const c = useImportModalController({ onClose });

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 dark:bg-black/70"
      onPointerDown={c.handleBackdropPointerDown}
      role="presentation"
    >
      <div
        aria-labelledby="import-modal-titulo"
        aria-modal
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onPointerDown={c.handleDialogPointerDown}
        role="dialog"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 id="import-modal-titulo" className="text-lg font-semibold text-slate-900 dark:text-white">
            Importar padrões
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Escolha JSON ou arquivos Markdown (.md / .mdc).
          </p>
        </div>
        <ImportModalOpenBody c={c} />
      </div>
    </div>
  );
};
