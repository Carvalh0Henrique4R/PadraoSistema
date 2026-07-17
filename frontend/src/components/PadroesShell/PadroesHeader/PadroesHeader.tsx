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
    <header className="flex shrink-0 flex-col border-b border-border bg-card/95 text-card-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 max-w-full items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
            aria-hidden
          >
            <Layers className="h-5 w-5 shrink-0" strokeWidth={1.9} />
          </div>
          <h1 className="truncate text-lg font-semibold text-foreground">Padrões</h1>
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
          <span className="shrink-0 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
            {patternCount} padrões
          </span>
          {showNovoButton ? (
            <button
              type="button"
              onClick={onNovoPadrao}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/85"
            >
              <Plus aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Novo padrão</span>
            </button>
          ) : null}
          {showLoggedInChrome && userDisplayName !== null ? (
            <PadroesHeaderUserMenu displayName={userDisplayName} />
          ) : null}
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
