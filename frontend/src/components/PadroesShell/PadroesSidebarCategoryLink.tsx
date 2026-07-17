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
      aria-label={PATTERN_CATEGORY_LABELS[slug]}
      title={PATTERN_CATEGORY_LABELS[slug]}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-all duration-150",
        isCategoryActive
          ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "border-transparent text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon aria-hidden className={navIconClass} data-lucide={dataLucide} />
    </Link>
  );
};
