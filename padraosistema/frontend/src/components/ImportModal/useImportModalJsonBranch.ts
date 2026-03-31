import type { ChangeEvent } from "react";
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
};

export type ImportModalJsonBranch = {
  formatHelpText: string;
  handleImportJsonClick: () => void;
  handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleFormatHelp: () => void;
  importMutation: ReturnType<typeof useImportPatternsMutation>;
  jsonText: string;
  parseError: string | null;
  resetErrors: () => void;
  showFormatHelp: boolean;
  submitError: string | null;
};

export const useImportModalJsonBranch = (params: Params): ImportModalJsonBranch => {
  const importMutation = useImportPatternsMutation();
  const [jsonText, setJsonText] = React.useState("");
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showFormatHelp, setShowFormatHelp] = React.useState(false);

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setJsonText(event.target.value);
  };

  const handleToggleFormatHelp = (): void => {
    setShowFormatHelp((previous) => !previous);
  };

  const runJsonImport = async (): Promise<void> => {
    const [parsed, parseErr] = tryCatch((): unknown => JSON.parse(jsonText));
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
    params.onClose();
  };

  const handleImportJsonClick = (): void => {
    void runJsonImport();
  };

  const resetErrors = (): void => {
    setParseError(null);
    setSubmitError(null);
  };

  return {
    formatHelpText: FORMAT_HELP_TEXT,
    handleImportJsonClick,
    handleJsonChange,
    handleToggleFormatHelp,
    importMutation,
    jsonText,
    parseError,
    resetErrors,
    showFormatHelp,
    submitError,
  };
};
