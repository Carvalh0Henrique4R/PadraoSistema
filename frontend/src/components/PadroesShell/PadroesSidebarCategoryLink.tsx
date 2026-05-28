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
        "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-150",
        isCategoryActive
          ? "bg-white text-[#078b7c] shadow-sm"
          : "text-white/90 hover:bg-white/15 hover:text-white",
      )}
    >
      <Icon aria-hidden className={navIconClass} data-lucide={dataLucide} />
    </Link>
  );
};
