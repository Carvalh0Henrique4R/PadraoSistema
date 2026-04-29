import React from "react";

type Props = {
  onClearSearch: () => void;
};

export const PadroesPatternListNoSearchResults: React.FC<Props> = ({ onClearSearch }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-400">Nenhum padrão corresponde à busca.</p>
      <button
        type="button"
        onClick={onClearSearch}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
      >
        Limpar busca
      </button>
    </div>
  );
};
