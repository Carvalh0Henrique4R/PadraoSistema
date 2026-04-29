import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { CartDrawer } from "~/components/CartDrawer/CartDrawer";
import { ExportHistoryPage } from "~/components/ExportHistoryPage/ExportHistoryPage";
import { PadroesPatternsLoadingView } from "~/components/PadroesPatternsLoadingView/PadroesPatternsLoadingView";
import { PadroesShell } from "~/components/PadroesShell/PadroesShell";
import { PatternCartProvider } from "~/context/PatternCartProvider";
import { usePatternsRouteSessionGuard } from "~/hooks/usePatternsRouteSessionGuard";

const ExportHistoryLayout: React.FC = () => {
  const guard = usePatternsRouteSessionGuard();

  if (guard === "loading") {
    return <PadroesPatternsLoadingView label="Carregando sessão…" />;
  }

  if (guard === "redirecting") {
    return <PadroesPatternsLoadingView label="Redirecionando…" />;
  }

  return (
    <PatternCartProvider>
      <PadroesShell>
        <ExportHistoryPage />
      </PadroesShell>
      <CartDrawer />
    </PatternCartProvider>
  );
};

export const Route = createFileRoute("/export-history")({
  component: ExportHistoryLayout,
});
