import type { useNavigate } from "@tanstack/react-router";
import React from "react";

export type PadroesShellImportModal = {
  handleCloseImport: () => void;
  handleOpenImport: () => void;
  importModalKey: number;
  importModalOpen: boolean;
};

export const usePadroesShellImportModal = (
  isLoggedIn: boolean,
  navigate: ReturnType<typeof useNavigate>,
): PadroesShellImportModal => {
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const [importModalKey, setImportModalKey] = React.useState(0);

  const handleOpenImport = React.useCallback((): void => {
    if (!isLoggedIn) {
      void navigate({ search: { redirect: "/patterns/" }, to: "/login" });
      return;
    }
    setImportModalKey((k) => k + 1);
    setImportModalOpen(true);
  }, [isLoggedIn, navigate]);

  const handleCloseImport = React.useCallback((): void => {
    setImportModalOpen(false);
  }, []);

  return {
    handleCloseImport,
    handleOpenImport,
    importModalKey,
    importModalOpen,
  };
};
