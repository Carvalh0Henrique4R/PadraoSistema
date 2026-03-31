import React from "react";
import { Link } from "@tanstack/react-router";
import { useExportHistoryQuery, useRetryExportFromHistory } from "~/api/exportHistory.hooks";
import { ExportHistoryRow } from "./ExportHistoryRow/ExportHistoryRow";

export const ExportHistoryPage: React.FC = () => {
  const { data, error, isError, isPending } = useExportHistoryQuery();
  const { retryError, retryExport } = useRetryExportFromHistory();

  if (isPending) {
    return <p className="px-6 py-8 text-slate-600 dark:text-slate-400">Carregando histórico…</p>;
  }

  if (isError) {
    return <p className="px-6 py-8 text-red-600 dark:text-red-400">{error.message}</p>;
  }

  const list = data ?? [];

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <div className="flex col-3 gap-3">
        <Link
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          to="/patterns"
        >
          ← Voltar
        </Link>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Histórico de exportação</h2>
      </div>
      {retryError === null ? null : <p className="text-sm text-red-600 dark:text-red-400">{retryError}</p>}
      {list.length === 0 ? <p className="text-slate-600 dark:text-slate-400">Nenhuma exportação ainda.</p> : null}
      <ul className="flex flex-col gap-2">
        {list.map((entry) => (
          <ExportHistoryRow key={entry.id} entry={entry} onRetry={retryExport} />
        ))}
      </ul>
    </div>
  );
};
