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

export const PadroesHeaderFeaturesMenu: React.FC<Props> = ({
  exportZipDisabled,
  onExportZip,
  onImportPatterns,
}) => {
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
        className="flex items-center gap-2 rounded-md border border-[#e7ecea] bg-[#f7f8f8] px-3 py-2 text-sm text-[#52615d] transition-colors duration-150 hover:border-[#0b8f7f]/40 hover:bg-[#eef4f2] hover:text-[#22302d] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
        onClick={handleToggleOpen}
      >
        <Settings aria-hidden className={iconClass} data-lucide="settings" />
        <span className="hidden sm:inline">Funcionalidades</span>
        <span className="sm:hidden">Funções</span>
      </button>
      {open ? (
        <div className="absolute start-0 top-full z-20 flex flex-col pt-2">
          <div
            className="min-w-52 rounded-md border border-[#e4ebe8] bg-white py-1 shadow-lg shadow-slate-300/40 dark:border-white/10 dark:bg-[#141d1b] dark:shadow-black/40"
            id={menuPanelId}
            role="menu"
          >
            <button
              type="button"
              className="flex w-full px-3 py-2 text-left text-sm text-[#52615d] transition-colors duration-150 hover:bg-[#eef4f2] dark:text-slate-200 dark:hover:bg-white/10"
              role="menuitem"
              onClick={handleImport}
            >
              Importar
            </button>
            <button
              type="button"
              disabled={exportZipDisabled}
              className="flex w-full px-3 py-2 text-left text-sm text-[#52615d] transition-colors duration-150 hover:bg-[#eef4f2] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-white/10"
              role="menuitem"
              onClick={handleExportZip}
            >
              Exportar
            </button>
            <Link
              to="/export-history"
              className="flex w-full px-3 py-2 text-left text-sm text-[#52615d] transition-colors duration-150 hover:bg-[#eef4f2] dark:text-slate-200 dark:hover:bg-white/10"
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
