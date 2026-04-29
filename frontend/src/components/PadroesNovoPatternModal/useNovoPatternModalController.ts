import type { ClipboardEvent, DragEvent, PointerEvent } from "react";
import { useCreatePatternMutation } from "~/api/patterns.hooks";
import {
  buildClipboardImageHandler,
  buildDropImageHandler,
  preventFormDragOver,
  stopDialogPointerDown,
  type MarkdownImageTarget,
} from "~/components/patternForm/markdownImageUploadHandlers";
import type { FormSubmitEvent } from "~/types/formSubmitEvent";
import { useNovoPatternFormCore } from "./useNovoPatternFormCore";

type Params = {
  onClose: () => void;
  open: boolean;
};

export type NovoPatternModalController = {
  contentValue: string;
  createMutation: ReturnType<typeof useCreatePatternMutation>;
  handleBackdropPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleClose: () => void;
  handleContentChange: (val: string) => void;
  handleDialogPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleEditorDrop: (event: DragEvent<HTMLFormElement>) => void;
  handleEditorPaste: (event: ClipboardEvent<HTMLFormElement>) => void;
  handleFormDragOver: (event: DragEvent<HTMLFormElement>) => void;
  register: ReturnType<typeof useNovoPatternFormCore>["register"];
  submitForm: (event: FormSubmitEvent) => void;
};

export const useNovoPatternModalController = ({ onClose, open }: Params): NovoPatternModalController => {
  const createMutation = useCreatePatternMutation();
  const { contentValue, handleSubmit, register, setValue } = useNovoPatternFormCore({ open });

  const handleClose = (): void => {
    onClose();
  };

  const runCreate = handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
    handleClose();
  });

  const submitForm = (event: FormSubmitEvent): void => {
    void runCreate(event);
  };

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleContentChange = (val: string): void => {
    setValue("content", val, { shouldDirty: true });
  };

  const setContent = (next: string): void => {
    setValue("content", next, { shouldDirty: true });
  };

  const target: MarkdownImageTarget = {
    getContent: () => contentValue,
    setContent,
  };

  const handleEditorPaste = buildClipboardImageHandler(target);
  const handleEditorDrop = buildDropImageHandler(target);

  return {
    contentValue,
    createMutation,
    handleBackdropPointerDown,
    handleClose,
    handleContentChange,
    handleDialogPointerDown: stopDialogPointerDown,
    handleEditorDrop,
    handleEditorPaste,
    handleFormDragOver: preventFormDragOver,
    register,
    submitForm,
  };
};
