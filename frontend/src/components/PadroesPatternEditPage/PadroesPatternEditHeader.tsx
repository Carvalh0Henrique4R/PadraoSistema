import React from "react";

type Props = {
  currentVersion: number;
  onBack: () => void;
  onOpenHistory: (() => void) | undefined;
  title: string;
};

export const PadroesPatternEditHeader: React.FC<Props> = ({
  currentVersion,
  onBack,
  onOpenHistory,
  title,
}) => {
  const handleHistoryClick = (): void => {
    if (onOpenHistory != null) {
      onOpenHistory();
    }
  };

  const historyButton =
    onOpenHistory == null ? null : (
      <button
        type="button"
        className="shrink-0 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-800 hover:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-200"
        onClick={handleHistoryClick}
      >
        Ver histórico
      </button>
    );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
        onClick={onBack}
      >
        ← Voltar
      </button>
      <h1 className="min-w-0 flex-1 text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:text-slate-400">
        v{currentVersion}
      </span>
      {historyButton}
    </div>
  );
};
