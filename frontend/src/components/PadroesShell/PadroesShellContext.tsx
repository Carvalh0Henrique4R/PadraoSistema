import React from "react";

type PadroesShellContextValue = {
  openNovoModal: () => void;
};

export const PadroesShellContext = React.createContext<PadroesShellContextValue | null>(null);

export const usePadroesShellContext = (): PadroesShellContextValue => {
  const ctx = React.useContext(PadroesShellContext);
  if (ctx == null) {
    throw new Error("usePadroesShellContext must be used within PadroesShell");
  }
  return ctx;
};
