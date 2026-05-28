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
    <aside className="flex w-12 shrink-0 flex-col items-center gap-4 bg-[#078b7c] px-2 py-5 text-white dark:bg-[#067466]">
      <nav className="flex flex-col items-center gap-2" aria-label="Categorias">
          <PadroesSidebarTodosLink pathname={pathname} />
          {PATTERN_CATEGORY_SLUGS.map((slug) => (
            <PadroesSidebarCategoryLink key={slug} icon={categoryNavIcons[slug]} pathname={pathname} slug={slug} />
          ))}
      </nav>
      <div className="mt-auto">
        <PadroesSidebarStatusSection patterns={patterns} />
      </div>
    </aside>
  );
};
