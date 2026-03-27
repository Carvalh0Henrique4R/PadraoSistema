import React from "react";
import { PadroesPatternEditHistoryDialogOpen } from "./PadroesPatternEditHistoryDialogOpen";

type Props = {
  onClose: () => void;
  open: boolean;
  patternId: string;
};

export const PadroesPatternEditHistoryDialog: React.FC<Props> = ({ onClose, open, patternId }) => {
  if (open === false) {
    return null;
  }
  return <PadroesPatternEditHistoryDialogOpen onClose={onClose} patternId={patternId} />;
};
