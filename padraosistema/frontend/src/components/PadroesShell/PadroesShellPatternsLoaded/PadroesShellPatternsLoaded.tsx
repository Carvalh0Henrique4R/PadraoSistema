import { type Pattern } from "@padraosistema/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { exportHistoryQueryKey } from "~/api/exportHistory";
import { ImportModal } from "~/components/ImportModal/ImportModal";
import { useFlashMessage } from "~/context/FlashMessageContext";
import { useCart } from "~/hooks/useCart";
import { usePatternCartZipExport } from "~/hooks/usePatternCartZipExport";
import { useSession } from "~/hooks/useSession";
import { PadroesHeader } from "../PadroesHeader/PadroesHeader";
import { PadroesShellListSearchProvider } from "../PadroesShellListSearchContext";
import { padroesShellUserDisplayName } from "../padroesShellUserDisplayName";
import { PadroesShellContext } from "../PadroesShellContext";
import { PadroesSidebar } from "../PadroesSidebar";

type Props = {
  children: React.ReactNode;
  patterns: Pattern[];
};

export const PadroesShellPatternsLoaded: React.FC<Props> = ({ children, patterns }) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const isLoggedIn = status === "authenticated";
  const userDisplayName = padroesShellUserDisplayName(status, session);
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const { clearCart, items } = useCart();
  const { showSuccess } = useFlashMessage();

  const invalidateExportHistory = React.useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: exportHistoryQueryKey });
  }, [queryClient]);

  const { exportError, handleExportClick } = usePatternCartZipExport({
    clearCart,
    extraOnSuccess: invalidateExportHistory,
    itemIds: items,
    showSuccess,
  });

  const handleOpenImport = React.useCallback((): void => {
    if (!isLoggedIn) {
      void navigate({ search: { redirect: "/patterns/" }, to: "/login" });
      return;
    }
    setImportModalOpen(true);
  }, [isLoggedIn, navigate]);

  const handleCloseImport = React.useCallback((): void => {
    setImportModalOpen(false);
  }, []);

  const handleOpenNovo = React.useCallback((): void => {
    if (!isLoggedIn) {
      void navigate({ search: { redirect: "/patterns/new" }, to: "/login" });
      return;
    }
    void navigate({ to: "/patterns/new" });
  }, [isLoggedIn, navigate]);

  const shellValue = React.useMemo(() => ({ openNovoModal: handleOpenNovo }), [handleOpenNovo]);

  return (
    <PadroesShellContext.Provider value={shellValue}>
      <PadroesShellListSearchProvider>
        <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
          <PadroesHeader
            exportZipError={exportError}
            patternCount={patterns.length}
            showLoggedInChrome={isLoggedIn}
            showNovoButton={isLoggedIn}
            userDisplayName={userDisplayName}
            onExportZip={handleExportClick}
            onImportPatterns={handleOpenImport}
            onNovoPadrao={handleOpenNovo}
          />
          <div className="flex min-h-0 flex-1">
            <PadroesSidebar patterns={patterns} />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">{children}</div>
          </div>
        </div>
      </PadroesShellListSearchProvider>
      <ImportModal open={importModalOpen} onClose={handleCloseImport} />
    </PadroesShellContext.Provider>
  );
};
