import React from "react";

type Props = {
  patternCount: number;
  onNovoPadrao: () => void;
};

export const PadroesHeader: React.FC<Props> = ({ patternCount, onNovoPadrao }) => {
  return (
    <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex shrink-0 flex-col gap-0.5 rounded-lg bg-indigo-500/20 p-2" aria-hidden>
          <span className="block h-1 rounded-sm bg-indigo-400/80" />
          <span className="block h-1 rounded-sm bg-indigo-400/60" />
          <span className="block h-1 rounded-sm bg-indigo-400/40" />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl font-semibold text-white">Padrões de Sistema</h1>
          <p className="text-sm text-slate-400">Documentação centralizada de padrões e componentes.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-1.5 text-sm text-slate-300">
          {patternCount} padrões
        </span>
        <button
          type="button"
          onClick={onNovoPadrao}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          + Novo Padrão
        </button>
      </div>
    </header>
  );
};
