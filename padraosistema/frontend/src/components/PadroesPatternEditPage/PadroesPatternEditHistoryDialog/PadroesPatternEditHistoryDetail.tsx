import type { PatternVersionDetail } from "@padraosistema/lib";
import React from "react";
import { useRevertPatternVersionMutation } from "~/api/patterns.hooks";
import { PadroesPatternEditHistoryRevertConfirmDialog } from "./PadroesPatternEditHistoryRevertConfirmDialog";

type Props = {
  detail: PatternVersionDetail | undefined;
  onBack: () => void;
  onReverted: () => void;
  patternId: string;
  state: "error" | "loading" | "ready";
};

export const PadroesPatternEditHistoryDetail: React.FC<Props> = ({ detail, onBack, onReverted, patternId, state }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const revertMutation = useRevertPatternVersionMutation();

  const handleBackClick = (): void => {
    onBack();
  };

  const handleOpenConfirm = (): void => {
    setConfirmOpen(true);
  };

  const handleCancelConfirm = (): void => {
    setConfirmOpen(false);
  };

  const handleRevertSucceeded = React.useCallback((): void => {
    setConfirmOpen(false);
    onReverted();
  }, [onReverted]);

  const handleConfirmRevert = (): void => {
    if (detail == null) {
      return;
    }
    revertMutation.mutate({ patternId, versionId: detail.id }, { onSuccess: handleRevertSucceeded });
  };

  if (state === "loading") {
    return <p className="text-sm text-slate-600 dark:text-slate-400">Carregando versão...</p>;
  }
  if (state === "error") {
    return <p className="text-sm text-red-600 dark:text-red-400">Não foi possível carregar esta versão.</p>;
  }
  if (detail == null) {
    return null;
  }

  const label = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(detail.createdAt));

  const formErrorMessage =
    revertMutation.isError && revertMutation.error instanceof Error ? revertMutation.error.message : null;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-3">
      <PadroesPatternEditHistoryRevertConfirmDialog
        isOpen={confirmOpen}
        isPending={revertMutation.isPending}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmRevert}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          onClick={handleBackClick}
        >
          ← Lista
        </button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          v{detail.version} · {label} · {detail.authorName}
        </span>
        <button
          type="button"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/50"
          disabled={revertMutation.isPending}
          onClick={handleOpenConfirm}
        >
          Reverter para esta versão
        </button>
      </div>
      {formErrorMessage != null ? <p className="text-sm text-red-600 dark:text-red-400">{formErrorMessage}</p> : null}
      <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
        <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-500">Título</span>
        <span className="text-slate-900 dark:text-white">{detail.title}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
        <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-500">Categoria</span>
        <span className="text-slate-800 dark:text-slate-200">{detail.category}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
        <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-500">Status</span>
        <span className="text-slate-800 dark:text-slate-200">{detail.status}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
        <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-500">Conteúdo</span>
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-slate-200">
          {detail.content}
        </pre>
      </div>
    </div>
  );
};
