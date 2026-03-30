import React from "react";

type Props = {
  createMutationPending: boolean;
  onCancel: () => void;
};

export const NovoPatternModalFooterActions: React.FC<Props> = ({ createMutationPending, onCancel }) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <button
        type="button"
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
        disabled={createMutationPending}
      >
        Criar padrão
      </button>
    </div>
  );
};
