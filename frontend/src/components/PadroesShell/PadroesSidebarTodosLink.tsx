import { Link } from "@tanstack/react-router";
import { Grid3x3 } from "lucide-react";
import React from "react";
import { cn } from "~/lib/cn";

const navIconClass = "h-4 w-4 shrink-0";

const todosPaths = ["/patterns", "/patterns/"];

type Props = {
  pathname: string;
};

export const PadroesSidebarTodosLink: React.FC<Props> = ({ pathname }) => {
  const isTodosActive = todosPaths.includes(pathname);

  return (
    <Link
      to="/patterns"
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
        isTodosActive
          ? "bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white"
          : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200",
      )}
    >
      <Grid3x3 aria-hidden className={navIconClass} data-lucide="grid-3x3" />
      Todos
    </Link>
  );
};
