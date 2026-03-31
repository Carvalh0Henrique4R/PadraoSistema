import type { ChangeEvent } from "react";
import React from "react";
import { tryCatchAsync } from "@padraosistema/lib";
import { useImportMarkdownPatternsMutation } from "~/api/patterns.hooks";

const MAX_MARKDOWN_FILES = 10;

const mergeSelectedMarkdownFiles = (prev: File[], selected: File[]): File[] => {
  return [...prev, ...selected].slice(0, MAX_MARKDOWN_FILES);
};

type Params = {
  onClose: () => void;
};

export type ImportModalMarkdownBranch = {
  fileInputKey: number;
  handleMarkdownFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMarkdownImportClick: () => void;
  handleRemoveMarkdownAt: (index: number) => void;
  importMarkdownMutation: ReturnType<typeof useImportMarkdownPatternsMutation>;
  markdownFiles: File[];
  resetErrors: () => void;
  submitError: string | null;
};

export const useImportModalMarkdownBranch = (params: Params): ImportModalMarkdownBranch => {
  const importMarkdownMutation = useImportMarkdownPatternsMutation();
  const [markdownFiles, setMarkdownFiles] = React.useState<File[]>([]);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = React.useState(0);

  const handleMarkdownFilesChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const list = event.target.files;
    if (list == null) {
      return;
    }
    setMarkdownFiles((prev) => mergeSelectedMarkdownFiles(prev, [...list]));
    setFileInputKey((k) => k + 1);
  };

  const handleRemoveMarkdownAt = (index: number): void => {
    setMarkdownFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const runMarkdownImport = async (): Promise<void> => {
    setSubmitError(null);
    const [, mutErr] = await tryCatchAsync(() => importMarkdownMutation.mutateAsync(markdownFiles));
    if (mutErr != null) {
      const msg = mutErr instanceof Error ? mutErr.message : "Falha na importação.";
      setSubmitError(msg);
      return;
    }
    setMarkdownFiles([]);
    params.onClose();
  };

  const handleMarkdownImportClick = (): void => {
    void runMarkdownImport();
  };

  const resetErrors = (): void => {
    setSubmitError(null);
  };

  return {
    fileInputKey,
    handleMarkdownFilesChange,
    handleMarkdownImportClick,
    handleRemoveMarkdownAt,
    importMarkdownMutation,
    markdownFiles,
    resetErrors,
    submitError,
  };
};
