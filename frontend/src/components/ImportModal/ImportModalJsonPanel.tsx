import type { ChangeEvent } from "react";
import React from "react";

const JSON_PLACEHOLDER =
  "Objeto com title, category, status e description; ou um array; ou um objeto com chave data.";

type Props = {
  formatHelpText: string;
  handleImportClick: () => void;
  handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleFormatHelp: () => void;
  importPending: boolean;
  jsonText: string;
  parseError: string | null;
  showFormatHelp: boolean;
  submitError: string | null;
};

export const ImportModalJsonPanel: React.FC<Props> = ({
  formatHelpText,
  handleImportClick,
  handleJsonChange,
  handleToggleFormatHelp,
  importPending,
  jsonText,
  parseError,
  showFormatHelp,
  submitError,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {showFormatHelp ? (
        <pre className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300">
          {formatHelpText}
        </pre>
      ) : null}
      <textarea
        className="min-h-48 w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400/60"
        onChange={handleJsonChange}
        placeholder={JSON_PLACEHOLDER}
        spellCheck={false}
        value={jsonText}
      />
      {parseError === null ? null : (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {parseError}
        </p>
      )}
      {submitError === null ? null : (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {submitError}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          disabled={importPending}
          onClick={handleImportClick}
        >
          Importar
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
          onClick={handleToggleFormatHelp}
        >
          Ver formato
        </button>
      </div>
    </div>
  );
};
