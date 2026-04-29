import React from "react";

type Props = {
  categoryLabel: string;
  onRemoveItem: (id: string) => void;
  patternId: string;
  title: string;
};

export const CartDrawerRow: React.FC<Props> = ({ categoryLabel, onRemoveItem, patternId, title }) => {
  const handleRemoveClick = React.useCallback((): void => {
    onRemoveItem(patternId);
  }, [onRemoveItem, patternId]);

  return (
    <li className="flex items-start justify-between gap-3 border-b border-slate-200 py-3 last:border-b-0 dark:border-white/10">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium text-slate-900 dark:text-white">{title}</span>
        <span className="text-xs text-slate-600 dark:text-slate-500">{categoryLabel}</span>
      </div>
      <button
        type="button"
        onClick={handleRemoveClick}
        className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:border-red-500/50 hover:text-red-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-red-500/40 dark:hover:text-red-300"
      >
        Remover
      </button>
    </li>
  );
};
