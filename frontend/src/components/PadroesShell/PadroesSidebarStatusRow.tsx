import React from "react";
import { cn } from "~/lib/cn";

type Props = {
  count: number;
  dotClass: string;
  label: string;
};

export const PadroesSidebarStatusRow: React.FC<Props> = ({ count, dotClass, label }) => {
  return (
    <li
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
      aria-label={`${label}: ${String(count)}`}
      title={`${label}: ${String(count)}`}
    >
      <span className={cn("inline-flex h-3 w-3 rounded-full ring-2 ring-white/40", dotClass)} />
    </li>
  );
};
