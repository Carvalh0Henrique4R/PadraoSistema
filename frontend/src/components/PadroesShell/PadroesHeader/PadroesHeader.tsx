import { Layers, Plus } from "lucide-react";
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

  return (
    <header className="flex shrink-0 flex-col border-b border-[#e7ecea] bg-white dark:border-white/10 dark:bg-[#141d1b]">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-5">
        <div className="flex min-w-0 max-w-full items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0b8f7f] text-white" aria-hidden>
            <Layers className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          </div>
          <h1 className="truncate text-lg font-semibold text-[#24332f] dark:text-white">Padrões</h1>
        </div>

        <div className="order-3 min-w-0 flex-[1_1_100%] sm:order-none sm:max-w-md sm:flex-1">
          {listSearch == null ? null : (
            <PadroesPatternListSearchBar
              layout="subheader"
              value={listSearch.value}
              onValueChange={listSearch.onValueChange}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {showLoggedInChrome ? (
            <PadroesHeaderFeaturesMenu
              exportZipDisabled={cartEmpty}
              onExportZip={onExportZip}
              onImportPatterns={onImportPatterns}
            />
          ) : null}
          <span className="shrink-0 rounded-md border border-[#e7ecea] bg-[#f7f8f8] px-3 py-1.5 text-sm font-medium text-[#52615d] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {patternCount} padrões
          </span>
          {showNovoButton ? (
            <button
              type="button"
              onClick={onNovoPadrao}
              className="flex shrink-0 items-center gap-2 rounded-md bg-[#0b8f7f] px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#087969]"
            >
              <Plus aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Novo padrão</span>
            </button>
          ) : null}
          {showLoggedInChrome && userDisplayName !== null ? <PadroesHeaderUserMenu displayName={userDisplayName} /> : null}
          <div className="flex shrink-0 items-center">
            <PadroesHeaderCartTrigger />
          </div>
        </div>
      </div>

      {exportZipError === null ? null : (
        <p className="px-6 pb-3 text-end text-xs text-red-600 dark:text-red-400">{exportZipError}</p>
      )}
    </header>
  );
};
