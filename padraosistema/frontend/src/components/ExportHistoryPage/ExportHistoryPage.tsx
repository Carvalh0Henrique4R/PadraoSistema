import React from "react";
import { Link } from "@tanstack/react-router";
import { useExportHistoryQuery, useRetryExportFromHistory } from "~/api/exportHistory.hooks";
import { ExportHistoryRow } from "./ExportHistoryRow/ExportHistoryRow";

export const ExportHistoryPage: React.FC = () => {
  const { data, error, isError, isPending } = useExportHistoryQuery();
  const { retryError, retryExport } = useRetryExportFromHistory();

  if (isPending) {
    return <p className="px-6 py-8 text-slate-400">Carregando histórico…</p>;
  }

  if (isError) {
    return <p className="px-6 py-8 text-red-400">{error.message}</p>;
  }

  const list = data ?? [];

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <Link
          to="/patterns"
          className="w-fit text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          Voltar aos padrões
        </Link>
        <h2 className="text-lg font-semibold text-white">Histórico de exportação</h2>
      </div>
      {retryError === null ? null : <p className="text-sm text-red-400">{retryError}</p>}
      {list.length === 0 ? <p className="text-slate-400">Nenhuma exportação ainda.</p> : null}
      <ul className="flex flex-col gap-2">
        {list.map((entry) => (
          <ExportHistoryRow key={entry.id} entry={entry} onRetry={retryExport} />
        ))}
      </ul>
    </div>
  );
};
