import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { buildPatternEditCategoryOptions } from "./padroesPatternEditCategoryOptions";
import { PadroesPatternEditActions } from "./PadroesPatternEditActions";
import { PadroesPatternEditHistoryDialog } from "./PadroesPatternEditHistoryDialog/PadroesPatternEditHistoryDialog";
import { PadroesPatternEditHeader } from "./PadroesPatternEditHeader";
import { PadroesPatternEditMarkdownSection } from "./PadroesPatternEditMarkdownSection";
import { PadroesPatternEditMetaRow } from "./PadroesPatternEditMetaRow";
import { PadroesPatternEditReadOnlyBanner } from "./PadroesPatternEditReadOnlyBanner";
import { usePadroesPatternEditController } from "./usePadroesPatternEditController";

type Props = {
  canEdit: boolean;
  pattern: Pattern;
};

export const PadroesPatternEditForm: React.FC<Props> = ({ canEdit, pattern }) => {
  const c = usePadroesPatternEditController({ canEdit, pattern });
  const categoryOptions = buildPatternEditCategoryOptions(pattern.category);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <PadroesPatternEditHeader
        currentVersion={pattern.version}
        onBack={c.handleBack}
        onOpenHistory={canEdit ? c.handleOpenHistory : undefined}
        title={pattern.title}
      />
      {canEdit ? (
        <PadroesPatternEditHistoryDialog
          onClose={c.handleCloseHistory}
          open={c.historyOpen}
          patternId={pattern.id}
        />
      ) : null}
      {canEdit === false ? <PadroesPatternEditReadOnlyBanner /> : null}
      <form
        className="flex max-w-4xl flex-col gap-4"
        onDragOver={c.handleFormDragOver}
        onDrop={c.handleEditorDrop}
        onPaste={c.handleEditorPaste}
        onSubmit={c.submitForm}
      >
        <PadroesPatternEditMetaRow canEdit={canEdit} categoryOptions={categoryOptions} register={c.register} />
        <PadroesPatternEditMarkdownSection
          canEdit={canEdit}
          contentValue={c.contentValue}
          onContentChange={c.handleContentChange}
        />
        {canEdit ? (
          <PadroesPatternEditActions
            deletePending={c.deleteMutation.isPending}
            onDelete={c.handleDeleteClick}
            updatePending={c.updateMutation.isPending}
          />
        ) : null}
      </form>
    </div>
  );
};
