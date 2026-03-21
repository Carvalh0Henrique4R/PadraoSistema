import { Outlet, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PadroesShell } from "~/components/PadroesShell/PadroesShell";

const PatternsLayout: React.FC = () => {
  return (
    <PadroesShell>
      <Outlet />
    </PadroesShell>
  );
};

export const Route = createFileRoute("/patterns")({
  component: PatternsLayout,
});
