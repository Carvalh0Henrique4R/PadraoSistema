import type { PatternVersionListItem } from "@padraosistema/lib";
import React from "react";
import { PadroesPatternEditHistoryListItem } from "./PadroesPatternEditHistoryListItem";

type Props = {
  items: PatternVersionListItem[] | undefined;
  onSelectVersion: (version: number) => void;
  state: "error" | "loading" | "ready";
};

export const PadroesPatternEditHistoryList: React.FC<Props> = ({ items, onSelectVersion, state }) => {
  if (state === "loading") {
    return <p className="text-sm text-slate-400">Carregando versões...</p>;
  }
  if (state === "error") {
    return <p className="text-sm text-red-400">Não foi possível carregar o histórico.</p>;
  }
  if (items == null || items.length === 0) {
    return <p className="text-sm text-slate-400">Nenhuma versão anterior arquivada.</p>;
  }
  return (
    <div className="flex flex-col gap-2 overflow-y-auto pb-2">
      {items.map((item) => (
        <PadroesPatternEditHistoryListItem item={item} key={item.version} onSelect={onSelectVersion} />
      ))}
    </div>
  );
};
