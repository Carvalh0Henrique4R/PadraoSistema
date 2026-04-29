import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { PadroesPatternListCategoryEmpty } from "./PadroesPatternListCategoryEmpty";
import { PadroesPatternListEmptyState } from "./PadroesPatternListEmptyState";
import { PadroesPatternListItem } from "./PadroesPatternListItem/PadroesPatternListItem";
import { PadroesPatternListNoSearchResults } from "./PadroesPatternListNoSearchResults";

type Props = {
  categorySlug: string | null;
  filtered: Pattern[];
  onClearSearch: () => void;
  patterns: Pattern[];
  searchTrimmedLength: number;
};

export const PadroesPatternListResults: React.FC<Props> = ({
  categorySlug,
  filtered,
  onClearSearch,
  patterns,
  searchTrimmedLength,
}) => {
  if (patterns.length === 0) {
    return <PadroesPatternListEmptyState />;
  }

  if (filtered.length === 0) {
    if (searchTrimmedLength > 0) {
      return <PadroesPatternListNoSearchResults onClearSearch={onClearSearch} />;
    }
    if (categorySlug != null) {
      return <PadroesPatternListCategoryEmpty />;
    }
    return <PadroesPatternListNoSearchResults onClearSearch={onClearSearch} />;
  }

  return (
    <ul className="flex flex-col gap-2 px-6 pb-8 pt-6">
      {filtered.map((pattern) => (
        <PadroesPatternListItem key={pattern.id} pattern={pattern} />
      ))}
    </ul>
  );
};
