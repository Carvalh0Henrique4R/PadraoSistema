import { Outlet, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PadroesPatternsLoadingView } from "~/components/PadroesPatternsLoadingView/PadroesPatternsLoadingView";
import { PadroesShell } from "~/components/PadroesShell/PadroesShell";
import { usePatternsRouteSessionGuard } from "~/hooks/usePatternsRouteSessionGuard";

const PatternsLayout: React.FC = () => {
  const guard = usePatternsRouteSessionGuard();

  if (guard === "loading") {
    return <PadroesPatternsLoadingView label="Carregando sessão…" />;
  }

  if (guard === "redirecting") {
    return <PadroesPatternsLoadingView label="Redirecionando…" />;
  }

  return (
    <PadroesShell>
      <Outlet />
    </PadroesShell>
  );
};

export const Route = createFileRoute("/patterns")({
  component: PatternsLayout,
});
