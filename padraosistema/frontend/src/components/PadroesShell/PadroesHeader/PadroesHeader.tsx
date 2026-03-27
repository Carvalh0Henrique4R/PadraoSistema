import React from "react";
import { PadroesHeaderAccountMenu } from "./PadroesHeaderAccountMenu";

type Props = {
  onNovoPadrao: () => void;
  patternCount: number;
  showAccountMenu: boolean;
  showNovoButton: boolean;
  userDisplayName: string | null;
};

export const PadroesHeader: React.FC<Props> = ({
  onNovoPadrao,
  patternCount,
  showAccountMenu,
  showNovoButton,
  userDisplayName,
}) => {
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
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {userDisplayName === null ? null : (
          <span className="max-w-48 truncate text-sm text-slate-400" title={userDisplayName}>
            {userDisplayName}
          </span>
        )}
        <span className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-1.5 text-sm text-slate-300">
          {patternCount} padrões
        </span>
        {showNovoButton ? (
          <button
            type="button"
            onClick={onNovoPadrao}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            + Novo Padrão
          </button>
        ) : null}
        {showAccountMenu ? <PadroesHeaderAccountMenu /> : null}
      </div>
    </header>
  );
};
