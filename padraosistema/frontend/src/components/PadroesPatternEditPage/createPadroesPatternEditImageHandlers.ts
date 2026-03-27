import type { ClipboardEvent, DragEvent } from "react";
import {
  buildClipboardImageHandlerWhenEditable,
  buildDropImageHandlerWhenEditable,
  type MarkdownImageTarget,
} from "~/components/patternForm/markdownImageUploadHandlers";

type Params = {
  canEdit: boolean;
  contentValue: string;
  setContent: (next: string) => void;
};

export const createPadroesPatternEditImageHandlers = ({
  canEdit,
  contentValue,
  setContent,
}: Params): {
  handleEditorDrop: (event: DragEvent<HTMLFormElement>) => void;
  handleEditorPaste: (event: ClipboardEvent<HTMLFormElement>) => void;
} => {
  const target: MarkdownImageTarget = {
    getContent: () => contentValue,
    setContent,
  };

  const handleEditorPaste = buildClipboardImageHandlerWhenEditable(canEdit, target);
  const handleEditorDrop = buildDropImageHandlerWhenEditable(canEdit, target);

  return { handleEditorDrop, handleEditorPaste };
};
