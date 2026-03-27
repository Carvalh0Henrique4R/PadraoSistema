import { type Pattern } from "@padraosistema/lib";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useSession } from "~/hooks/useSession";
import { PadroesHeader } from "../PadroesHeader/PadroesHeader";
import { padroesShellUserDisplayName } from "../padroesShellUserDisplayName";
import { PadroesShellContext } from "../PadroesShellContext";
import { PadroesSidebar } from "../PadroesSidebar";

type Props = {
  children: React.ReactNode;
  patterns: Pattern[];
};

export const PadroesShellPatternsLoaded: React.FC<Props> = ({ children, patterns }) => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const isLoggedIn = status === "authenticated";
  const userDisplayName = padroesShellUserDisplayName(status, session);

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
      <div className="flex min-h-full flex-1 flex-col bg-slate-950 text-white">
        <PadroesHeader
          patternCount={patterns.length}
          showAccountMenu={isLoggedIn}
          showNovoButton={isLoggedIn}
          userDisplayName={userDisplayName}
          onNovoPadrao={handleOpenNovo}
        />
        <div className="flex min-h-0 flex-1">
          <PadroesSidebar patterns={patterns} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">{children}</div>
        </div>
      </div>
    </PadroesShellContext.Provider>
  );
};
