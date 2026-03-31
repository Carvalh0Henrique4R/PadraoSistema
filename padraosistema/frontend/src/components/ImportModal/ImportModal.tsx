import { X } from "lucide-react";
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
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id="import-modal-titulo" className="text-lg font-semibold text-slate-900 dark:text-white">
              Importar padrões
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Escolha JSON ou arquivos Markdown (.md / .mdc).
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            className="flex shrink-0 items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5 dark:focus-visible:ring-indigo-400/80"
            onClick={c.handleClose}
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <ImportModalOpenBody c={c} />
      </div>
    </div>
  );
};
