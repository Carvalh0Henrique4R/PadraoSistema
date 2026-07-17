import React from "react";

type Props = {
  deletePending: boolean;
  onDelete: () => void;
  updatePending: boolean;
};

export const PadroesPatternEditActions: React.FC<Props> = ({ deletePending, onDelete, updatePending }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/85 disabled:opacity-50"
        disabled={updatePending}
      >
        Salvar alterações
      </button>
      <button
        type="button"
        className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/85 disabled:opacity-50"
        disabled={deletePending}
        onClick={onDelete}
      >
        Excluir
      </button>
    </div>
  );
};
