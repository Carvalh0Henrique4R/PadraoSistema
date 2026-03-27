import React from "react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onPointerDown={c.handleBackdropPointerDown}
      role="presentation"
    >
      <div
        aria-labelledby="novo-padrao-titulo"
        aria-modal
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
        onPointerDown={c.handleDialogPointerDown}
        role="dialog"
      >
        <div className="flex flex-col gap-1 border-b border-white/10 px-6 py-4">
          <h2 id="novo-padrao-titulo" className="text-lg font-semibold text-white">
            Novo padrão
          </h2>
          <p className="text-sm text-slate-400">Preencha os dados para documentar um novo padrão.</p>
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
