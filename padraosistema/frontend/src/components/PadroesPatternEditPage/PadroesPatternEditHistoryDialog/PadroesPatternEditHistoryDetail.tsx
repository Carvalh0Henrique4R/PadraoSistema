import type { PatternVersionDetail } from "@padraosistema/lib";
import React from "react";

type Props = {
  detail: PatternVersionDetail | undefined;
  onBack: () => void;
  state: "error" | "loading" | "ready";
};

export const PadroesPatternEditHistoryDetail: React.FC<Props> = ({ detail, onBack, state }) => {
  const handleBackClick = (): void => {
    onBack();
  };

  if (state === "loading") {
    return <p className="text-sm text-slate-400">Carregando versão...</p>;
  }
  if (state === "error") {
    return <p className="text-sm text-red-400">Não foi possível carregar esta versão.</p>;
  }
  if (detail == null) {
    return null;
  }

  const label = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(detail.createdAt));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
          onClick={handleBackClick}
        >
          ← Lista
        </button>
        <span className="text-sm text-slate-400">
          v{detail.version} · {label} · {detail.authorName}
        </span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Título</span>
        <span className="text-white">{detail.title}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Categoria</span>
        <span className="text-slate-200">{detail.category}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Status</span>
        <span className="text-slate-200">{detail.status}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Conteúdo</span>
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-200">
          {detail.content}
        </pre>
      </div>
    </div>
  );
};
