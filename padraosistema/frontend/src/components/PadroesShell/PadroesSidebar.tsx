import { Link, useRouterState } from "@tanstack/react-router";
import type { Pattern, PatternStatus } from "@padraosistema/lib";
import { Box, Code, Database, Grid3x3, Layout, Zap, type LucideIcon } from "lucide-react";
import React from "react";
import {
  PATTERN_CATEGORY_LABELS,
  PATTERN_CATEGORY_SLUGS,
  type PatternCategorySlug,
} from "~/constants/patternCategories";

type Props = {
  patterns: Pattern[];
};

const statusOrder: PatternStatus[] = ["stable", "review", "draft", "deprecated"];

const statusMeta: Record<PatternStatus, { label: string; dotClass: string }> = {
  stable: { label: "Estável", dotClass: "bg-emerald-400" },
  review: { label: "Em revisão", dotClass: "bg-amber-400" },
  draft: { label: "Rascunho", dotClass: "bg-violet-400" },
  deprecated: { label: "Depreciado", dotClass: "bg-red-400" },
};

const categoryNavIcons: Record<PatternCategorySlug, { Icon: LucideIcon; dataLucide: string }> = {
  componentes: { Icon: Box, dataLucide: "box" },
  layouts: { Icon: Layout, dataLucide: "layout" },
  comportamentos: { Icon: Zap, dataLucide: "zap" },
  apis: { Icon: Code, dataLucide: "code" },
  dados: { Icon: Database, dataLucide: "database" },
};

const navIconClass = "h-4 w-4 shrink-0";

const countByStatus = (patterns: Pattern[], status: PatternStatus): number => {
  return patterns.filter((p) => p.status === status).length;
};

export const PadroesSidebar: React.FC<Props> = ({ patterns }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isTodosActive = pathname === "/patterns" || pathname === "/patterns/";

  const isCategoryActive = (slug: PatternCategorySlug): boolean => {
    return pathname === `/patterns/${slug}` || pathname === `/patterns/${slug}/`;
  };

  return (
    <aside className="flex shrink-0 flex-col gap-8 border-r border-white/10 bg-slate-950/50 px-4 py-6">
      <div className="flex flex-col gap-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Categorias</p>
        <nav className="flex flex-col gap-1">
          <Link
            to="/patterns"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              isTodosActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Grid3x3 className={navIconClass} data-lucide="grid-3x3" aria-hidden />
            Todos
          </Link>
          {PATTERN_CATEGORY_SLUGS.map((slug) => {
            const { Icon, dataLucide } = categoryNavIcons[slug];
            return (
              <Link
                key={slug}
                to="/patterns/$segment"
                params={{ segment: slug }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isCategoryActive(slug)
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className={navIconClass} data-lucide={dataLucide} aria-hidden />
                {PATTERN_CATEGORY_LABELS[slug]}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
        <ul className="flex flex-col gap-2">
          {statusOrder.map((status) => (
            <li
              key={status}
              className="flex flex-row items-center justify-between gap-2 px-2 text-sm text-slate-400"
            >
              <span className="flex flex-row items-center gap-2">
                <span
                  className={`inline-flex h-2 min-h-2 w-2 min-w-2 rounded-full ${statusMeta[status].dotClass}`}
                />
                {statusMeta[status].label}
              </span>
              <span className="tabular-nums text-slate-500">{countByStatus(patterns, status)}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
