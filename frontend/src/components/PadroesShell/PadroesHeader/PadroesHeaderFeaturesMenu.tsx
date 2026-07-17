import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import React from "react";
import { usePadroesHeaderDropdownDismiss } from "../usePadroesHeaderDropdownDismiss";

const iconClass = "h-4 w-4 shrink-0";

type Props = {
  exportZipDisabled: boolean;
  onExportZip: () => void;
  onImportPatterns: () => void;
};

export const PadroesHeaderFeaturesMenu: React.FC<Props> = ({ exportZipDisabled, onExportZip, onImportPatterns }) => {
  const menuPanelId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  usePadroesHeaderDropdownDismiss({ open, rootRef, setOpen });

  const handleToggleOpen = React.useCallback((): void => {
    setOpen((prev) => !prev);
  }, []);

  const handleImport = React.useCallback((): void => {
    setOpen(false);
    onImportPatterns();
  }, [onImportPatterns]);

  const handleExportZip = React.useCallback((): void => {
    setOpen(false);
    onExportZip();
  }, [onExportZip]);

  return (
    <div ref={rootRef} className="relative flex shrink-0">
      <button
        type="button"
        aria-controls={menuPanelId}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-xs transition-colors duration-150 hover:border-ring/35 hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        onClick={handleToggleOpen}
      >
        <Settings aria-hidden className={iconClass} data-lucide="settings" />
        <span className="hidden sm:inline">Funcionalidades</span>
        <span className="sm:hidden">Funções</span>
      </button>
      {open ? (
        <div className="absolute start-0 top-full z-20 flex flex-col pt-2">
          <div
            className="min-w-52 rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg"
            id={menuPanelId}
            role="menu"
          >
            <button
              type="button"
              className="flex w-full px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
              role="menuitem"
              onClick={handleImport}
            >
              Importar
            </button>
            <button
              type="button"
              disabled={exportZipDisabled}
              className="flex w-full px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              role="menuitem"
              onClick={handleExportZip}
            >
              Exportar
            </button>
            <Link
              to="/export-history"
              className="flex w-full px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
              role="menuitem"
              onClick={(): void => {
                setOpen(false);
              }}
            >
              Histórico
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};
