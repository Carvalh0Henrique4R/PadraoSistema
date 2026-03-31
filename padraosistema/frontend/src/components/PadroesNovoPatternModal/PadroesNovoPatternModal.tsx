import React from "react";
import { X } from "lucide-react";
import { NovoPatternModalFormFields } from "./NovoPatternModalFormFields";
import { useNovoPatternModalController } from "./useNovoPatternModalController";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const PadroesNovoPatternModal: React.FC<Props> = ({ open, onClose }) => {
  const c = useNovoPatternModalController({ onClose, open });

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
        aria-labelledby="novo-padrao-titulo"
        aria-modal
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onPointerDown={c.handleDialogPointerDown}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id="novo-padrao-titulo" className="text-lg font-semibold text-slate-900 dark:text-white">
              Novo padrão
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Preencha os dados para documentar um novo padrão.</p>          
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

        <NovoPatternModalFormFields
          contentValue={c.contentValue}
          createMutationPending={c.createMutation.isPending}
          handleClose={c.handleClose}
          handleContentChange={c.handleContentChange}
          onDragOver={c.handleFormDragOver}
          onDrop={c.handleEditorDrop}
          onPaste={c.handleEditorPaste}
          register={c.register}
          submitForm={c.submitForm}
        />
      </div>
    </div>
  );
};
