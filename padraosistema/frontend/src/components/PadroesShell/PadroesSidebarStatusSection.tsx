import type { Pattern, PatternStatus } from "@padraosistema/lib";
import React from "react";
import { PadroesSidebarStatusRow } from "./PadroesSidebarStatusRow";

const statusOrder: PatternStatus[] = ["stable", "review", "draft", "deprecated"];

const statusMeta: Record<PatternStatus, { dotClass: string; label: string }> = {
  stable: { label: "Estável", dotClass: "bg-emerald-400" },
  review: { label: "Em revisão", dotClass: "bg-amber-400" },
  draft: { label: "Rascunho", dotClass: "bg-violet-400" },
  deprecated: { label: "Depreciado", dotClass: "bg-red-400" },
};

const countByStatus = (patterns: Pattern[], status: PatternStatus): number => {
  return patterns.filter((p) => p.status === status).length;
};

type Props = {
  patterns: Pattern[];
};

export const PadroesSidebarStatusSection: React.FC<Props> = ({ patterns }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
      <ul className="flex flex-col gap-2">
        {statusOrder.map((status) => (
          <PadroesSidebarStatusRow
            key={status}
            count={countByStatus(patterns, status)}
            dotClass={statusMeta[status].dotClass}
            label={statusMeta[status].label}
          />
        ))}
      </ul>
    </div>
  );
};
