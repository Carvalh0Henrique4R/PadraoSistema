import React from "react";

type Props = {
  disabled: boolean;
  onExportClick: () => void;
};

export const CartDrawerExportFooter: React.FC<Props> = ({ disabled, onExportClick }) => {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
      <button
        type="button"
        disabled={disabled}
        onClick={onExportClick}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Exportar ZIP
      </button>
    </div>
  );
};
