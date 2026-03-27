import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "~/lib/cn";
import { PATTERN_CATEGORY_LABELS, type PatternCategorySlug } from "~/constants/patternCategories";

const navIconClass = "h-4 w-4 shrink-0";

type Props = {
  icon: { dataLucide: string; Icon: LucideIcon };
  pathname: string;
  slug: PatternCategorySlug;
};

export const PadroesSidebarCategoryLink: React.FC<Props> = ({ icon, pathname, slug }) => {
  const base = `/patterns/${slug}`;
  const pathsForSlug = [base, `${base}/`];
  const isCategoryActive = pathsForSlug.includes(pathname);
  const { dataLucide, Icon } = icon;

  return (
    <Link
      params={{ segment: slug }}
      to="/patterns/$segment"
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
        isCategoryActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
      )}
    >
      <Icon aria-hidden className={navIconClass} data-lucide={dataLucide} />
      {PATTERN_CATEGORY_LABELS[slug]}
    </Link>
  );
};
