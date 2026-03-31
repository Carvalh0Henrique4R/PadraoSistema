import React from "react";
import type { ImportModalController } from "./useImportModalController";
import { ImportModalJsonPanel } from "./ImportModalJsonPanel";
import { ImportModalMarkdownPanel } from "./ImportModalMarkdownPanel";
import { ImportModalModeSwitch } from "./ImportModalModeSwitch";

type Props = {
  c: ImportModalController;
};

export const ImportModalOpenBody: React.FC<Props> = ({ c }) => {
  return (
    <div className="flex flex-col gap-3 overflow-auto px-6 py-4">
      <ImportModalModeSwitch
        mode={c.mode}
        onSelectJson={c.handleSelectJsonMode}
        onSelectMarkdown={c.handleSelectMarkdownMode}
      />
      {c.mode === "json" ? (
        <ImportModalJsonPanel
          formatHelpText={c.formatHelpText}
          handleImportClick={c.handleImportJsonClick}
          handleJsonChange={c.handleJsonChange}
          handleToggleFormatHelp={c.handleToggleFormatHelp}
          importPending={c.importPending}
          jsonText={c.jsonText}
          parseError={c.parseError}
          showFormatHelp={c.showFormatHelp}
          submitError={c.submitErrorJson}
        />
      ) : (
        <ImportModalMarkdownPanel
          fileInputKey={c.markdownFileInputKey}
          files={c.markdownFiles}
          importPending={c.importPending}
          onFilesChange={c.handleMarkdownFilesChange}
          onImport={c.handleMarkdownImportClick}
          onRemoveAt={c.handleRemoveMarkdownAt}
          submitError={c.submitErrorMarkdown}
        />
      )}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
          onClick={c.handleClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
