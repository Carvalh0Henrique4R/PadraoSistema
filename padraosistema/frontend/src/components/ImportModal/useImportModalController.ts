import type { PointerEvent } from "react";
import React from "react";
import { importModalStopDialogPointerDown } from "./importModalDialogPointer";
import { useImportModalJsonBranch } from "./useImportModalJsonBranch";
import { useImportModalMarkdownBranch } from "./useImportModalMarkdownBranch";

type ImportMode = "json" | "markdown";

type Params = {
  onClose: () => void;
};

export type ImportModalController = {
  formatHelpText: string;
  handleBackdropPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  handleDialogPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleImportJsonClick: () => void;
  handleJsonChange: ReturnType<typeof useImportModalJsonBranch>["handleJsonChange"];
  handleMarkdownFilesChange: ReturnType<typeof useImportModalMarkdownBranch>["handleMarkdownFilesChange"];
  handleMarkdownImportClick: () => void;
  handleRemoveMarkdownAt: (index: number) => void;
  handleSelectJsonMode: () => void;
  handleSelectMarkdownMode: () => void;
  handleToggleFormatHelp: () => void;
  importMarkdownMutation: ReturnType<typeof useImportModalMarkdownBranch>["importMarkdownMutation"];
  importMutation: ReturnType<typeof useImportModalJsonBranch>["importMutation"];
  importPending: boolean;
  jsonText: string;
  markdownFileInputKey: number;
  markdownFiles: File[];
  mode: ImportMode;
  parseError: string | null;
  showFormatHelp: boolean;
  submitErrorJson: string | null;
  submitErrorMarkdown: string | null;
};

export const useImportModalController = ({ onClose }: Params): ImportModalController => {
  const jsonBranch = useImportModalJsonBranch({ onClose });
  const mdBranch = useImportModalMarkdownBranch({ onClose });
  const [mode, setMode] = React.useState<ImportMode>("json");

  const importPending =
    jsonBranch.importMutation.isPending ? true : mdBranch.importMarkdownMutation.isPending;

  const handleClose = (): void => {
    onClose();
  };

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleSelectJsonMode = (): void => {
    mdBranch.resetErrors();
    setMode("json");
  };

  const handleSelectMarkdownMode = (): void => {
    jsonBranch.resetErrors();
    setMode("markdown");
  };

  return {
    formatHelpText: jsonBranch.formatHelpText,
    handleBackdropPointerDown,
    handleClose,
    handleDialogPointerDown: importModalStopDialogPointerDown,
    handleImportJsonClick: jsonBranch.handleImportJsonClick,
    handleJsonChange: jsonBranch.handleJsonChange,
    handleMarkdownFilesChange: mdBranch.handleMarkdownFilesChange,
    handleMarkdownImportClick: mdBranch.handleMarkdownImportClick,
    handleRemoveMarkdownAt: mdBranch.handleRemoveMarkdownAt,
    handleSelectJsonMode,
    handleSelectMarkdownMode,
    handleToggleFormatHelp: jsonBranch.handleToggleFormatHelp,
    importMarkdownMutation: mdBranch.importMarkdownMutation,
    importMutation: jsonBranch.importMutation,
    importPending,
    jsonText: jsonBranch.jsonText,
    markdownFileInputKey: mdBranch.fileInputKey,
    markdownFiles: mdBranch.markdownFiles,
    mode,
    parseError: jsonBranch.parseError,
    showFormatHelp: jsonBranch.showFormatHelp,
    submitErrorJson: jsonBranch.submitError,
    submitErrorMarkdown: mdBranch.submitError,
  };
};
