import { useRouterState } from "@tanstack/react-router";
import type { Pattern } from "@padraosistema/lib";
import { Box, Code, Database, Layout, Zap, type LucideIcon } from "lucide-react";
import React from "react";
import { PATTERN_CATEGORY_SLUGS, type PatternCategorySlug } from "~/constants/patternCategories";
import { PadroesSidebarCategoryLink } from "./PadroesSidebarCategoryLink";
import { PadroesSidebarStatusSection } from "./PadroesSidebarStatusSection";
import { PadroesSidebarTodosLink } from "./PadroesSidebarTodosLink";

type Props = {
  patterns: Pattern[];
};

const categoryNavIcons: Record<PatternCategorySlug, { Icon: LucideIcon; dataLucide: string }> = {
  componentes: { Icon: Box, dataLucide: "box" },
  layouts: { Icon: Layout, dataLucide: "layout" },
  comportamentos: { Icon: Zap, dataLucide: "zap" },
  apis: { Icon: Code, dataLucide: "code" },
  dados: { Icon: Database, dataLucide: "database" },
};

export const PadroesSidebar: React.FC<Props> = ({ patterns }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex shrink-0 flex-col gap-8 border-r border-slate-200 bg-slate-100/80 px-4 py-6 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex flex-col gap-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-500">Categorias</p>
        <nav className="flex flex-col gap-1">
          <PadroesSidebarTodosLink pathname={pathname} />
          {PATTERN_CATEGORY_SLUGS.map((slug) => (
            <PadroesSidebarCategoryLink key={slug} icon={categoryNavIcons[slug]} pathname={pathname} slug={slug} />
          ))}
        </nav>
      </div>
      <PadroesSidebarStatusSection patterns={patterns} />
    </aside>
  );
};
