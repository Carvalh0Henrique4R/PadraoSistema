import React from "react";
import { MarkdownEditor } from "~/components/MarkdownEditor";

type Props = {
  contentValue: string;
  onContentChange: (val: string) => void;
};

export const NovoPatternModalMarkdownSection: React.FC<Props> = ({ contentValue, onContentChange }) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <span className="text-sm text-slate-700 dark:text-slate-300">Descrição (Markdown)</span>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <MarkdownEditor readOnly={undefined} value={contentValue} onBlur={undefined} onChange={onContentChange} />
      </div>
    </div>
  );
};
