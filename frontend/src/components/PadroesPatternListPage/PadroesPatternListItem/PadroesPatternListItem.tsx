import { Link } from "@tanstack/react-router";
import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { PATTERN_CATEGORY_LABELS, isPatternCategorySlug } from "~/constants/patternCategories";
import { PadroesPatternListItemAddToCartButton } from "./PadroesPatternListItemAddToCartButton";

type Props = {
  pattern: Pattern;
};

const categoryLabel = (category: string): string => {
  if (isPatternCategorySlug(category)) {
    return PATTERN_CATEGORY_LABELS[category];
  }
  return category;
};

export const PadroesPatternListItem: React.FC<Props> = ({ pattern }) => {
  return (
    <li>
      <div className="flex min-h-28 items-stretch gap-2 rounded-md border border-[#e4ebe8] bg-white shadow-sm shadow-[#dfe6e3]/50 transition-colors duration-150 hover:border-[#0b8f7f]/40 hover:bg-[#f7fbfa] dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-[#0b8f7f]/60 dark:hover:bg-white/10">
        <Link
          to="/patterns/$segment"
          params={{ segment: pattern.id }}
          className="flex min-w-0 flex-1 flex-col justify-between gap-4 px-4 py-3 text-left"
        >
          <span className="line-clamp-2 font-semibold text-[#22302d] dark:text-white">{pattern.title}</span>
          <span className="w-fit rounded-md bg-[#eef4f2] px-2 py-1 text-xs font-medium text-[#52615d] dark:bg-white/10 dark:text-slate-300">
            {categoryLabel(pattern.category)}
          </span>
        </Link>
        <div className="flex shrink-0 items-center pr-3">
          <PadroesPatternListItemAddToCartButton pattern={pattern} />
        </div>
      </div>
    </li>
  );
};
