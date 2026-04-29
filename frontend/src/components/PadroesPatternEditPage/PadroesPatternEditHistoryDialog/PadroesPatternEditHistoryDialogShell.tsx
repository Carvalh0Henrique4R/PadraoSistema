import { X } from "lucide-react";
import React from "react";

const stopDialogPointerPropagation = (event: React.PointerEvent<HTMLDivElement>): void => {
  event.stopPropagation();
};

type Props = {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
};

export const PadroesPatternEditHistoryDialogShell: React.FC<Props> = ({ children, onClose, title }) => {
  const handleOverlayPointerDown = (): void => {
    onClose();
  };

  const handleCloseClick = (): void => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 dark:bg-black/60"
      onPointerDown={handleOverlayPointerDown}
      role="presentation"
    >
      <div
        className="flex max-h-full min-h-0 max-w-2xl flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-slate-900"
        onPointerDown={stopDialogPointerPropagation}
        role="dialog"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button
            type="button"
            aria-label="Fechar"
            className="flex shrink-0 items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5 dark:focus-visible:ring-indigo-400/80"
            onClick={handleCloseClick}
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
