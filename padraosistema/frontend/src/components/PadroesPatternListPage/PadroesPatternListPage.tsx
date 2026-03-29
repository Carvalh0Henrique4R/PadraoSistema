import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { usePatternsQuery } from "~/api/patterns.hooks";
import { useRegisterPadroesListSearchInHeader } from "~/components/PadroesShell/PadroesShellListSearchContext";
import { PadroesPatternListResults } from "./PadroesPatternListResults";

type Props = {
  categorySlug: string | null;
};

type FilterInput = {
  categorySlug: string | null;
  patterns: Pattern[];
  search: string;
};

const filterPatterns = ({ categorySlug, patterns, search }: FilterInput): Pattern[] => {
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

  const handleSearchValueChange = React.useCallback((value: string): void => {
    setSearch(value);
  }, []);

  const handleClearSearch = React.useCallback((): void => {
    setSearch("");
  }, []);

  useRegisterPadroesListSearchInHeader(search, handleSearchValueChange);

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center p-6 text-slate-400">Carregando...</div>;
  }

  if (isError || patterns == null) {
    return <div className="flex flex-1 items-center justify-center p-6 text-red-400">Erro ao carregar padrões.</div>;
  }

  const filtered = filterPatterns({ categorySlug, patterns, search });
  const searchTrimmedLength = search.trim().length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PadroesPatternListResults
        categorySlug={categorySlug}
        filtered={filtered}
        onClearSearch={handleClearSearch}
        patterns={patterns}
        searchTrimmedLength={searchTrimmedLength}
      />
    </div>
  );
};
