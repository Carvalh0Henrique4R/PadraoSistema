import React from "react";
import { MarkdownEditor } from "~/components/MarkdownEditor";

type Props = {
  canEdit: boolean;
  contentValue: string;
  onContentChange: (val: string) => void;
};

export const PadroesPatternEditMarkdownSection: React.FC<Props> = ({ canEdit, contentValue, onContentChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-slate-700 dark:text-slate-300">Descrição (Markdown)</span>
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <MarkdownEditor
          readOnly={canEdit === false}
          value={contentValue}
          onBlur={undefined}
          onChange={onContentChange}
        />
      </div>
    </div>
  );
};
