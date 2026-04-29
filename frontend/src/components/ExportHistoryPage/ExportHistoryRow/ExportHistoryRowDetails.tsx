import type { ExportHistory } from "@padraosistema/lib";
import { PATTERN_CATEGORY_LABELS, isPatternCategorySlug } from "@padraosistema/lib";
import React from "react";

type Props = {
  entry: ExportHistory;
  onRetry: (historyId: string) => void;
};

const categoryLabel = (slug: string): string => {
  return isPatternCategorySlug(slug) ? PATTERN_CATEGORY_LABELS[slug] : slug;
};

export const ExportHistoryRowDetails: React.FC<Props> = ({ entry, onRetry }) => {
  const handleRetry = React.useCallback((): void => {
    onRetry(entry.id);
  }, [entry.id, onRetry]);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 transition-opacity duration-200 ease-out dark:border-white/10">
      <ul className="flex flex-col gap-2">
        {entry.patterns.map((p) => (
          <li key={p.id} className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-950/50">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {categoryLabel(p.category)} · {p.status}
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleRetry}
        className="self-end rounded-lg border border-indigo-500/60 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-800 hover:bg-indigo-500/20 dark:border-indigo-500/50 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
      >
        Exportar novamente
      </button>
    </div>
  );
};
