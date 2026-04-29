import React from "react";
import { ImportModalMarkdownFileRow } from "./ImportModalMarkdownFileRow";

const MAX_FILES = 10;

type Props = {
  fileInputKey: number;
  files: File[];
  importPending: boolean;
  onFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onRemoveAt: (index: number) => void;
  submitError: string | null;
};

export const ImportModalMarkdownPanel: React.FC<Props> = ({
  fileInputKey,
  files,
  importPending,
  onFilesChange,
  onImport,
  onRemoveAt,
  submitError,
}) => {
  const importDisabled = importPending ? true : files.length === 0;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Categoria e status serão definidos automaticamente. Você poderá editar após a importação.
      </p>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Arquivos (.md ou .mdc)</span>
        <input
          accept=".md,.mdc"
          className="text-sm text-slate-800 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white dark:text-slate-200"
          disabled={importPending}
          key={String(fileInputKey)}
          multiple
          onChange={onFilesChange}
          type="file"
        />
      </label>
      <p className="text-xs text-slate-500 dark:text-slate-500">Até {String(MAX_FILES)} arquivos por envio.</p>
      {files.length === 0 ? null : (
        <ul className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-white/10">
          {files.map((file, index) => (
            <ImportModalMarkdownFileRow
              disabled={importPending}
              file={file}
              index={index}
              key={String(index)}
              onRemoveAt={onRemoveAt}
            />
          ))}
        </ul>
      )}
      {submitError === null ? null : (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="button"
        className="self-start rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
        disabled={importDisabled}
        onClick={onImport}
      >
        Importar
      </button>
    </div>
  );
};
