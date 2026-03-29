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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onPointerDown={c.handleBackdropPointerDown}
      role="presentation"
    >
      <div
        aria-labelledby="import-modal-titulo"
        aria-modal
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
        onPointerDown={c.handleDialogPointerDown}
        role="dialog"
      >
        <div className="flex flex-col gap-1 border-b border-white/10 px-6 py-4">
          <h2 id="import-modal-titulo" className="text-lg font-semibold text-white">
            Importar padrões
          </h2>
          <p className="text-sm text-slate-400">Cole um JSON com um padrão ou uma lista de padrões.</p>
        </div>
        <div className="flex flex-col gap-3 overflow-auto px-6 py-4">
          {c.showFormatHelp ? (
            <pre className="max-h-64 overflow-auto rounded-lg border border-white/10 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {c.formatHelpText}
            </pre>
          ) : null}
          <textarea
            className="min-h-48 w-full flex-1 resize-y rounded-lg border border-white/15 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-indigo-400/60"
            onChange={c.handleJsonChange}
            placeholder={JSON_PLACEHOLDER}
            spellCheck={false}
            value={c.jsonText}
          />
          {c.parseError === null ? null : (
            <p className="text-sm text-red-400" role="alert">
              {c.parseError}
            </p>
          )}
          {c.submitError === null ? null : (
            <p className="text-sm text-red-400" role="alert">
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
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
              onClick={c.handleToggleFormatHelp}
            >
              Ver formato
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
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
