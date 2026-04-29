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
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
        disabled={updatePending}
      >
        Salvar alterações
      </button>
      <button
        type="button"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
        disabled={deletePending}
        onClick={onDelete}
      >
        Excluir
      </button>
    </div>
  );
};
