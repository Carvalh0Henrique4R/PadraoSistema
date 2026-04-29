import React from "react";
import { usePatternVersionQuery, usePatternVersionsQuery } from "~/api/patterns.hooks";
import { PadroesPatternEditHistoryDetail } from "./PadroesPatternEditHistoryDetail";
import { PadroesPatternEditHistoryList } from "./PadroesPatternEditHistoryList";
import { PadroesPatternEditHistoryDialogShell } from "./PadroesPatternEditHistoryDialogShell";
import { queryResultToHistoryDisplayState } from "./patternHistoryQueryDisplayState";

type Props = {
  onClose: () => void;
  patternId: string;
};

export const PadroesPatternEditHistoryDialogOpen: React.FC<Props> = ({ onClose, patternId }) => {
  const [selectedVersion, setSelectedVersion] = React.useState<number | undefined>();
  const listQuery = usePatternVersionsQuery(patternId, true);
  const detailQuery = usePatternVersionQuery({
    enabled: selectedVersion != null,
    patternId,
    version: selectedVersion,
  });

  const handleSelectVersion = (version: number): void => {
    setSelectedVersion(version);
  };

  const handleDetailBack = (): void => {
    setSelectedVersion(undefined);
  };

  const handleReverted = (): void => {
    setSelectedVersion(undefined);
  };

  const listState = queryResultToHistoryDisplayState(listQuery);
  const detailState = queryResultToHistoryDisplayState(detailQuery);

  const body =
    selectedVersion == null ? (
      <PadroesPatternEditHistoryList items={listQuery.data} onSelectVersion={handleSelectVersion} state={listState} />
    ) : (
      <PadroesPatternEditHistoryDetail
        detail={detailQuery.data}
        onBack={handleDetailBack}
        onReverted={handleReverted}
        patternId={patternId}
        state={detailState}
      />
    );

  return (
    <PadroesPatternEditHistoryDialogShell onClose={onClose} title="Histórico de versões">
      {body}
    </PadroesPatternEditHistoryDialogShell>
  );
};
