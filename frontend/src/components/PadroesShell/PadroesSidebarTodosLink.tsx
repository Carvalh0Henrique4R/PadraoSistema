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
        "flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-all duration-150",
        isTodosActive
          ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "border-transparent text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Grid3x3 aria-hidden className={navIconClass} data-lucide="grid-3x3" />
    </Link>
  );
};
