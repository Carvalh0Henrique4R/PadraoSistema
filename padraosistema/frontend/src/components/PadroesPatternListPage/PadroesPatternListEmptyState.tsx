import React from "react";
import { usePadroesShellContext } from "~/components/PadroesShell/PadroesShellContext";

export const PadroesPatternListEmptyState: React.FC = () => {
  const { openNovoModal } = usePadroesShellContext();

  const handleCriarPrimeiro = (): void => {
    openNovoModal();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-slate-600" aria-hidden>
        <span className="text-6xl leading-none">📄</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Nenhum padrão documentado</h2>
        <p className="max-w-md text-sm text-slate-400">Comece adicionando o primeiro padrão do seu sistema</p>
      </div>
      <button
        type="button"
        onClick={handleCriarPrimeiro}
        className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        + Criar primeiro padrão
      </button>
    </div>
  );
};
