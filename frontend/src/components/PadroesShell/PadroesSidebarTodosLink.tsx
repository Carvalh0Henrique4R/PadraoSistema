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
      aria-label="Todos"
      title="Todos"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-150",
        isTodosActive
          ? "bg-white text-[#078b7c] shadow-sm"
          : "text-white/90 hover:bg-white/15 hover:text-white",
      )}
    >
      <Grid3x3 aria-hidden className={navIconClass} data-lucide="grid-3x3" />
    </Link>
  );
};
