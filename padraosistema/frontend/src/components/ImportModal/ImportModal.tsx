import React from "react";
import { useImportModalController } from "./useImportModalController";

const JSON_PLACEHOLDER =
  "Objeto com title, category, status e description; ou um array; ou um objeto com chave data.";

type Props = {
  onClose: () => void;
  open: boolean;
};

export const ImportModal: React.FC<Props> = ({ onClose, open }) => {
  const c = useImportModalController({ onClose, open });

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 dark:bg-black/70"
      onPointerDown={c.handleBackdropPointerDown}
      role="presentation"
    >
      <div
        aria-labelledby="import-modal-titulo"
        aria-modal
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onPointerDown={c.handleDialogPointerDown}
        role="dialog"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 id="import-modal-titulo" className="text-lg font-semibold text-slate-900 dark:text-white">
            Importar padrões
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Cole um JSON com um padrão ou uma lista de padrões.</p>
        </div>
        <div className="flex flex-col gap-3 overflow-auto px-6 py-4">
          {c.showFormatHelp ? (
            <pre className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300">
              {c.formatHelpText}
            </pre>
          ) : null}
          <textarea
            className="min-h-48 w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400/60"
            onChange={c.handleJsonChange}
            placeholder={JSON_PLACEHOLDER}
            spellCheck={false}
            value={c.jsonText}
          />
          {c.parseError === null ? null : (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {c.parseError}
            </p>
          )}
          {c.submitError === null ? null : (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {c.submitError}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
              disabled={c.importMutation.isPending}
              onClick={c.handleImportClick}
            >
              Importar
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
              onClick={c.handleToggleFormatHelp}
            >
              Ver formato
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
              onClick={c.handleClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
