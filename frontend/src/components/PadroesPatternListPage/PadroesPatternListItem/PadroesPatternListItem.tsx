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
      <div className="flex min-h-32 items-stretch gap-2 rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-ring/35 hover:shadow-md">
        <Link
          to="/patterns/$segment"
          params={{ segment: pattern.id }}
          className="flex min-w-0 flex-1 flex-col justify-between gap-4 px-4 py-4 text-left"
        >
          <span className="line-clamp-2 font-semibold text-card-foreground">{pattern.title}</span>
          <span className="w-fit rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
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
