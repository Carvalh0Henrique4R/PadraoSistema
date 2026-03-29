import type { ExportHistory } from "@padraosistema/lib";
import React from "react";
import { ExportHistoryRowDetails } from "./ExportHistoryRowDetails";

type Props = {
  entry: ExportHistory;
  onRetry: (historyId: string) => void;
};

const formatExportDate = (iso: string): string => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
};

export const ExportHistoryRow: React.FC<Props> = ({ entry, onRetry }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = React.useCallback((): void => {
    setExpanded((open) => !open);
  }, []);

  return (
    <li className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 transition-colors duration-150 ease-out hover:border-white/20 hover:bg-slate-900/80">
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-white/5"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-slate-200">Exportado em: {formatExportDate(entry.createdAt)}</p>
          <p className="text-xs text-slate-400">{String(entry.patterns.length)} patterns</p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-indigo-300">
          {expanded ? "Recolher" : "Expandir"}
        </span>
      </button>
      {expanded ? <ExportHistoryRowDetails entry={entry} onRetry={onRetry} /> : null}
    </li>
  );
};
