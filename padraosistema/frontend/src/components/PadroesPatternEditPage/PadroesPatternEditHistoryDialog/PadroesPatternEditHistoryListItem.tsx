import type { PatternVersionListItem } from "@padraosistema/lib";
import React from "react";

type Props = {
  item: PatternVersionListItem;
  onSelect: (version: number) => void;
};

export const PadroesPatternEditHistoryListItem: React.FC<Props> = ({ item, onSelect }) => {
  const handleClick = (): void => {
    onSelect(item.version);
  };
  const label = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(item.createdAt));

  return (
    <button
      type="button"
      className="flex w-full flex-col items-start gap-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80"
      onClick={handleClick}
    >
      <span className="text-sm font-medium text-white">
        v{item.version} — {item.title}
      </span>
      <span className="text-xs text-slate-400">
        {label} · {item.authorName}
      </span>
    </button>
  );
};
