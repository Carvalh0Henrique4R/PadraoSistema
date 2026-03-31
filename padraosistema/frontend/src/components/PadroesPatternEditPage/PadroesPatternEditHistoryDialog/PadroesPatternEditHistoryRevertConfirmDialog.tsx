import React from "react";

const stopDialogPointerPropagation = (event: React.PointerEvent<HTMLDivElement>): void => {
  event.stopPropagation();
};

type Props = {
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const PadroesPatternEditHistoryRevertConfirmDialog: React.FC<Props> = ({
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}) => {
  const handleOverlayPointerDown = (): void => {
    if (!isPending) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-10 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center dark:bg-black/50"
      onPointerDown={handleOverlayPointerDown}
      role="presentation"
    >
      <div
        className="flex max-w-md flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-slate-900"
        onPointerDown={stopDialogPointerPropagation}
        role="dialog"
        aria-labelledby="revert-confirm-title"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-white" id="revert-confirm-title">
          Restaurar versão
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tem certeza que deseja reverter para esta versão?</p>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50 dark:border-red-900/50"
            disabled={isPending}
            onClick={onConfirm}
          >
            Reverter
          </button>
        </div>
      </div>
    </div>
  );
};
