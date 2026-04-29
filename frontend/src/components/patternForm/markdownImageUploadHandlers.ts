import type { ClipboardEvent, DragEvent, PointerEvent } from "react";
import { uploadPatternImage } from "~/api/patterns";

export type MarkdownImageTarget = {
  getContent: () => string;
  setContent: (next: string) => void;
};

export const preventFormDragOver = (event: DragEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

export const stopDialogPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
  event.stopPropagation();
};

const appendImageMarkdown = (current: string, url: string): string => `${current}\n\n![imagem](${url})`;

const appendFromUpload = async (file: File | null, target: MarkdownImageTarget): Promise<void> => {
  if (file == null) {
    return;
  }
  if (!file.type.startsWith("image/")) {
    return;
  }
  const { url } = await uploadPatternImage(file);
  target.setContent(appendImageMarkdown(target.getContent(), url));
};

const pasteImagesFromClipboard = async (
  event: ClipboardEvent<HTMLFormElement>,
  target: MarkdownImageTarget,
): Promise<void> => {
  const { items } = event.clipboardData;
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    index += 1;
    if (!item.type.startsWith("image/")) {
      continue;
    }
    event.preventDefault();
    const file = item.getAsFile();
    await appendFromUpload(file, target);
  }
};

const pasteImagesFromDrop = async (event: DragEvent<HTMLFormElement>, target: MarkdownImageTarget): Promise<void> => {
  event.preventDefault();
  const { files } = event.dataTransfer;
  if (files.length === 0) {
    return;
  }
  let index = 0;
  while (index < files.length) {
    const file = files.item(index);
    index += 1;
    await appendFromUpload(file, target);
  }
};

export const buildClipboardImageHandler = (
  target: MarkdownImageTarget,
): ((event: ClipboardEvent<HTMLFormElement>) => void) => {
  return (event) => {
    void pasteImagesFromClipboard(event, target);
  };
};

export const buildDropImageHandler = (target: MarkdownImageTarget): ((event: DragEvent<HTMLFormElement>) => void) => {
  return (event) => {
    void pasteImagesFromDrop(event, target);
  };
};

export const buildClipboardImageHandlerWhenEditable = (
  canEdit: boolean,
  target: MarkdownImageTarget,
): ((event: ClipboardEvent<HTMLFormElement>) => void) => {
  return (event) => {
    if (!canEdit) {
      return;
    }
    void pasteImagesFromClipboard(event, target);
  };
};

export const buildDropImageHandlerWhenEditable = (
  canEdit: boolean,
  target: MarkdownImageTarget,
): ((event: DragEvent<HTMLFormElement>) => void) => {
  return (event) => {
    if (!canEdit) {
      return;
    }
    void pasteImagesFromDrop(event, target);
  };
};
