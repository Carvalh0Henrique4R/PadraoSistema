import type { PointerEvent } from "react";
import React from "react";
import { tryCatch, tryCatchAsync } from "@padraosistema/lib";
import { useImportPatternsMutation } from "~/api/patterns.hooks";

const FORMAT_HELP_TEXT = `Um objeto:

{
  "title": "Nome do padrão",
  "category": "Componentes",
  "status": "rascunho",
  "description": "Conteúdo em markdown"
}

Ou um array:

[
  {
    "title": "Pattern 1",
    "category": "Componentes",
    "status": "estavel",
    "description": "Conteúdo"
  },
  {
    "title": "Pattern 2",
    "category": "APIs",
    "status": "review",
    "description": "Conteúdo"
  }
]

Status aceitos (português ou inglês): rascunho/draft, estavel/stable, review/revisão, deprecated/depreciado/obsoleto.`;

type Params = {
  onClose: () => void;
  open: boolean;
};

export type ImportModalController = {
  formatHelpText: string;
  handleBackdropPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  handleDialogPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleImportClick: () => void;
  handleJsonChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleFormatHelp: () => void;
  importMutation: ReturnType<typeof useImportPatternsMutation>;
  jsonText: string;
  parseError: string | null;
  showFormatHelp: boolean;
  submitError: string | null;
};

export const useImportModalController = ({ onClose, open }: Params): ImportModalController => {
  const importMutation = useImportPatternsMutation();
  const [jsonText, setJsonText] = React.useState("");
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showFormatHelp, setShowFormatHelp] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    setJsonText("");
    setParseError(null);
    setSubmitError(null);
    setShowFormatHelp(false);
  }, [open]);

  const handleClose = (): void => {
    onClose();
  };

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleDialogPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setJsonText(event.target.value);
  };

  const handleToggleFormatHelp = (): void => {
    setShowFormatHelp((previous) => !previous);
  };

  const runImport = async (): Promise<void> => {
    const [parsed, parseErr] = tryCatch(() => JSON.parse(jsonText) as unknown);
    if (parseErr != null) {
      setParseError("JSON inválido. Verifique a sintaxe.");
      return;
    }
    setParseError(null);
    setSubmitError(null);
    const [, mutErr] = await tryCatchAsync(() => importMutation.mutateAsync(parsed));
    if (mutErr != null) {
      const msg = mutErr instanceof Error ? mutErr.message : "Falha na importação.";
      setSubmitError(msg);
      return;
    }
    setJsonText("");
    handleClose();
  };

  const handleImportClick = (): void => {
    void runImport();
  };

  return {
    formatHelpText: FORMAT_HELP_TEXT,
    handleBackdropPointerDown,
    handleClose,
    handleDialogPointerDown,
    handleImportClick,
    handleJsonChange,
    handleToggleFormatHelp,
    importMutation,
    jsonText,
    parseError,
    showFormatHelp,
    submitError,
  };
};
