import React from "react";
import { usePatternsQuery } from "~/api/patterns.hooks";
import { PadroesNovoPatternModal } from "~/components/PadroesNovoPatternModal/PadroesNovoPatternModal";
import { PadroesHeader } from "./PadroesHeader";
import { PadroesShellContext } from "./PadroesShellContext";
import { PadroesSidebar } from "./PadroesSidebar";

type Props = {
  children: React.ReactNode;
};

export const PadroesShell: React.FC<Props> = ({ children }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data: patterns, isLoading, isError } = usePatternsQuery();

  const handleOpenModal = React.useCallback((): void => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback((): void => {
    setModalOpen(false);
  }, []);

  const shellValue = React.useMemo(() => ({ openNovoModal: handleOpenModal }), [handleOpenModal]);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-950 text-slate-300">
        Carregando padrões...
      </div>
    );
  }

  if (isError || patterns == null) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-950 text-red-400">
        Erro ao carregar padrões.
      </div>
    );
  }

  return (
    <PadroesShellContext.Provider value={shellValue}>
      <div className="flex min-h-full flex-1 flex-col bg-slate-950 text-white">
        <PadroesHeader patternCount={patterns.length} onNovoPadrao={handleOpenModal} />
        <div className="flex min-h-0 flex-1">
          <PadroesSidebar patterns={patterns} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">{children}</div>
        </div>
        <PadroesNovoPatternModal open={modalOpen} onClose={handleCloseModal} />
      </div>
    </PadroesShellContext.Provider>
  );
};
