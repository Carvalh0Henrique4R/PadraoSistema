import React from "react";
import { usePatternsQuery } from "~/api/patterns.hooks";
import { PadroesShellPatternsLoaded } from "./PadroesShellPatternsLoaded/PadroesShellPatternsLoaded";

type Props = {
  children: React.ReactNode;
};

export const PadroesShell: React.FC<Props> = ({ children }) => {
  const { data: patterns, isLoading, isError } = usePatternsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-950 text-slate-300">
        Carregando padrões...
      </div>
    );
  }

  if (isError || patterns == null) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-950 text-red-400">
        Erro ao carregar padrões.
      </div>
    );
  }

  return <PadroesShellPatternsLoaded patterns={patterns}>{children}</PadroesShellPatternsLoaded>;
};
