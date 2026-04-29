import React from "react";
import { cn } from "~/lib/cn";

type Props = {
  count: number;
  dotClass: string;
  label: string;
};

export const PadroesSidebarStatusRow: React.FC<Props> = ({ count, dotClass, label }) => {
  return (
    <li className="flex flex-row items-center justify-between gap-2 px-2 text-sm text-slate-600 dark:text-slate-400">
      <span className="flex flex-row items-center gap-2">
        <span className={cn("inline-flex h-2 min-h-2 w-2 min-w-2 rounded-full", dotClass)} />
        {label}
      </span>
      <span className="tabular-nums text-slate-700 dark:text-slate-500">{count}</span>
    </li>
  );
};
