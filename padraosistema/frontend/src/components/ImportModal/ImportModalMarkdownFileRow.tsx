import React from "react";

type Props = {
  disabled: boolean;
  file: File;
  index: number;
  onRemoveAt: (index: number) => void;
};

export const ImportModalMarkdownFileRow: React.FC<Props> = ({ disabled, file, index, onRemoveAt }) => {
  const handleRemoveClick = (): void => {
    onRemoveAt(index);
  };

  return (
    <li className="flex items-center gap-2">
      <span className="min-w-0 flex-1 truncate text-sm text-slate-800 dark:text-slate-200">{file.name}</span>
      <button
        type="button"
        className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
        disabled={disabled}
        onClick={handleRemoveClick}
      >
        Remover
      </button>
    </li>
  );
};
