import { Link } from "@tanstack/react-router";
import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { PATTERN_CATEGORY_LABELS, isPatternCategorySlug } from "~/constants/patternCategories";

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
      <Link
        to="/patterns/$segment"
        params={{ segment: pattern.id }}
        className="flex flex-col gap-1 rounded-lg border border-white/5 bg-slate-900/50 px-4 py-3 text-left hover:border-indigo-500/40 hover:bg-slate-900"
      >
        <span className="font-medium text-white">{pattern.title}</span>
        <span className="text-xs text-slate-500">{categoryLabel(pattern.category)}</span>
      </Link>
    </li>
  );
};
