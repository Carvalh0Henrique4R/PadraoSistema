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
      <div className="flex items-stretch gap-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-400/60 hover:bg-slate-50 dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900">
        <Link
          to="/patterns/$segment"
          params={{ segment: pattern.id }}
          className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3 text-left"
        >
          <span className="font-medium text-slate-900 dark:text-white">{pattern.title}</span>
          <span className="text-xs text-slate-600 dark:text-slate-500">{categoryLabel(pattern.category)}</span>
        </Link>
        <div className="flex shrink-0 items-center pr-3">
          <PadroesPatternListItemAddToCartButton pattern={pattern} />
        </div>
      </div>
    </li>
  );
};
