import React from "react";

type Props = {
  currentVersion: number;
  onBack: () => void;
  onOpenHistory: (() => void) | undefined;
  title: string;
};

export const PadroesPatternEditHeader: React.FC<Props> = ({ currentVersion, onBack, onOpenHistory, title }) => {
  const handleHistoryClick = (): void => {
    if (onOpenHistory != null) {
      onOpenHistory();
    }
  };

  const historyButton =
    onOpenHistory == null ? null : (
      <button
        type="button"
        className="shrink-0 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
        onClick={handleHistoryClick}
      >
        Ver histórico
      </button>
    );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={onBack}
      >
        ← Voltar
      </button>
      <h1 className="min-w-0 flex-1 text-xl font-semibold text-foreground">{title}</h1>
      <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        v{currentVersion}
      </span>
      {historyButton}
    </div>
  );
};
