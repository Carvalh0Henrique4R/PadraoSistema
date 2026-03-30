import React from "react";
import { PadroesPatternListSearchBar } from "~/components/PadroesPatternListPage/PadroesPatternListSearchBar";
import { useCart } from "~/hooks/useCart";
import { usePadroesShellListSearchRegistration } from "../PadroesShellListSearchContext";
import { PadroesHeaderCartTrigger } from "./PadroesHeaderCartTrigger";
import { PadroesHeaderFeaturesMenu } from "./PadroesHeaderFeaturesMenu";
import { PadroesHeaderUserMenu } from "./PadroesHeaderUserMenu";

type Props = {
  exportZipError: string | null;
  onExportZip: () => void;
  onImportPatterns: () => void;
  onNovoPadrao: () => void;
  patternCount: number;
  showLoggedInChrome: boolean;
  showNovoButton: boolean;
  userDisplayName: string | null;
};

export const PadroesHeader: React.FC<Props> = ({
  exportZipError,
  onExportZip,
  onImportPatterns,
  onNovoPadrao,
  patternCount,
  showLoggedInChrome,
  showNovoButton,
  userDisplayName,
}) => {
  const listSearch = usePadroesShellListSearchRegistration();
  const { items } = useCart();
  const cartEmpty = items.length === 0;

  const showSubHeader = listSearch != null || showNovoButton;

  return (
    <header className="flex shrink-0 flex-col border-b border-slate-200 dark:border-white/10">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 max-w-full items-start gap-3">
          <div className="flex shrink-0 flex-col gap-0.5 rounded-lg bg-indigo-500/15 p-2 dark:bg-indigo-500/20" aria-hidden>
            <span className="block h-1 rounded-sm bg-indigo-500/70 dark:bg-indigo-400/80" />
            <span className="block h-1 rounded-sm bg-indigo-500/50 dark:bg-indigo-400/60" />
            <span className="block h-1 rounded-sm bg-indigo-500/35 dark:bg-indigo-400/40" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Padrões de Sistema</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Documentação centralizada de padrões e componentes.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {showLoggedInChrome ? (
            <PadroesHeaderFeaturesMenu
              exportZipDisabled={cartEmpty}
              onExportZip={onExportZip}
              onImportPatterns={onImportPatterns}
            />
          ) : null}
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
            {patternCount} padrões
          </span>
          {showLoggedInChrome && userDisplayName !== null ? (
            <PadroesHeaderUserMenu displayName={userDisplayName} />
          ) : null}
          <div className="flex shrink-0 items-center">
            <PadroesHeaderCartTrigger />
          </div>
        </div>
      </div>

      {showSubHeader ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-6 py-3 dark:border-white/10">
          <div className="min-w-0 flex-1">
            {listSearch != null ? (
              <PadroesPatternListSearchBar
                layout="subheader"
                value={listSearch.value}
                onValueChange={listSearch.onValueChange}
              />
            ) : null}
          </div>
          {showNovoButton ? (
            <button
              type="button"
              onClick={onNovoPadrao}
              className="shrink-0 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-indigo-400"
            >
              + Novo padrão
            </button>
          ) : null}
        </div>
      ) : null}

      {exportZipError === null ? null : (
        <p className="px-6 pb-3 text-end text-xs text-red-600 dark:text-red-400">{exportZipError}</p>
      )}
    </header>
  );
};
