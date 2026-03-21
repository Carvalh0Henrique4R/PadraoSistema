import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { usePatternsQuery } from "~/api/patterns.hooks";
import { PadroesPatternListEmptyState } from "./PadroesPatternListEmptyState";
import { PadroesPatternListItems } from "./PadroesPatternListItems";
import { PadroesPatternListCategoryEmpty } from "./PadroesPatternListCategoryEmpty";
import { PadroesPatternListNoSearchResults } from "./PadroesPatternListNoSearchResults";
import { PadroesPatternListSearchBar } from "./PadroesPatternListSearchBar";

type Props = {
  categorySlug: string | null;
};

const filterPatterns = (patterns: Pattern[], categorySlug: string | null, search: string): Pattern[] => {
  const q = search.trim().toLowerCase();
  return patterns.filter((pattern) => {
    const matchesCategory = categorySlug == null ? true : pattern.category === categorySlug;
    const matchesSearch = q.length === 0 ? true : pattern.title.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
};

export const PadroesPatternListPage: React.FC<Props> = ({ categorySlug }) => {
  const { data: patterns, isLoading, isError } = usePatternsQuery();
  const [search, setSearch] = React.useState("");

  const handleSearchValueChange = (value: string): void => {
    setSearch(value);
  };

  const handleClearSearch = (): void => {
    setSearch("");
  };

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center p-6 text-slate-400">Carregando...</div>;
  }

  if (isError || patterns == null) {
    return <div className="flex flex-1 items-center justify-center p-6 text-red-400">Erro ao carregar padrões.</div>;
  }

  const filtered = filterPatterns(patterns, categorySlug, search);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PadroesPatternListSearchBar value={search} onValueChange={handleSearchValueChange} />
      {patterns.length === 0 ? (
        <PadroesPatternListEmptyState />
      ) : filtered.length === 0 ? (
        search.trim().length > 0 ? (
          <PadroesPatternListNoSearchResults onClearSearch={handleClearSearch} />
        ) : categorySlug != null ? (
          <PadroesPatternListCategoryEmpty />
        ) : (
          <PadroesPatternListNoSearchResults onClearSearch={handleClearSearch} />
        )
      ) : (
        <PadroesPatternListItems patterns={filtered} />
      )}
    </div>
  );
};
