import React from "react";

type ImportMode = "json" | "markdown";

type Props = {
  mode: ImportMode;
  onSelectJson: () => void;
  onSelectMarkdown: () => void;
};

export const ImportModalModeSwitch: React.FC<Props> = ({ mode, onSelectJson, onSelectMarkdown }) => {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 p-1 dark:border-white/15" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "json"}
        className={
          mode === "json"
            ? "flex-1 rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white"
            : "flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
        }
        onClick={onSelectJson}
      >
        JSON
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "markdown"}
        className={
          mode === "markdown"
            ? "flex-1 rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white"
            : "flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
        }
        onClick={onSelectMarkdown}
      >
        Markdown
      </button>
    </div>
  );
};
