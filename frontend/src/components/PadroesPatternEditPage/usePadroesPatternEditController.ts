import type { Pattern } from "@padraosistema/lib";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import type { ClipboardEvent, DragEvent } from "react";
import { useDeletePatternMutation, useUpdatePatternMutation } from "~/api/patterns.hooks";
import { preventFormDragOver } from "~/components/patternForm/markdownImageUploadHandlers";
import type { FormSubmitEvent } from "~/types/formSubmitEvent";
import { createPadroesPatternEditImageHandlers } from "./createPadroesPatternEditImageHandlers";
import { usePadroesPatternEditFormCore } from "./usePadroesPatternEditFormCore";

type Params = {
  canEdit: boolean;
  pattern: Pattern;
};

export type PadroesPatternEditController = {
  contentValue: string;
  deleteMutation: ReturnType<typeof useDeletePatternMutation>;
  handleBack: () => void;
  handleCloseHistory: () => void;
  handleContentChange: (val: string) => void;
  handleDeleteClick: () => void;
  handleEditorDrop: (event: DragEvent<HTMLFormElement>) => void;
  handleEditorPaste: (event: ClipboardEvent<HTMLFormElement>) => void;
  handleFormDragOver: (event: DragEvent<HTMLFormElement>) => void;
  handleOpenHistory: () => void;
  historyOpen: boolean;
  register: ReturnType<typeof usePadroesPatternEditFormCore>["register"];
  submitForm: (event: FormSubmitEvent) => void;
  updateMutation: ReturnType<typeof useUpdatePatternMutation>;
};

export const usePadroesPatternEditController = ({ canEdit, pattern }: Params): PadroesPatternEditController => {
  const navigate = useNavigate();
  const updateMutation = useUpdatePatternMutation();
  const deleteMutation = useDeletePatternMutation();
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const { contentValue, handleSubmit, register, setValue } = usePadroesPatternEditFormCore(pattern);

  const { handleEditorDrop, handleEditorPaste } = createPadroesPatternEditImageHandlers({
    canEdit,
    contentValue,
    setContent: (next) => {
      setValue("content", next, { shouldDirty: true });
    },
  });

  const handleBack = (): void => {
    void navigate({ to: "/patterns" });
  };

  const runDelete = async (): Promise<void> => {
    await deleteMutation.mutateAsync(pattern.id);
    handleBack();
  };

  const handleDeleteClick = (): void => {
    void runDelete();
  };

  const runUpdate = handleSubmit(async (values) => {
    await updateMutation.mutateAsync({ id: pattern.id, input: values });
  });

  const submitForm = (event: FormSubmitEvent): void => {
    void runUpdate(event);
  };

  const handleContentChange = (val: string): void => {
    setValue("content", val, { shouldDirty: true });
  };

  const handleOpenHistory = (): void => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = (): void => {
    setHistoryOpen(false);
  };

  return {
    contentValue,
    deleteMutation,
    handleBack,
    handleCloseHistory,
    handleContentChange,
    handleDeleteClick,
    handleEditorDrop,
    handleEditorPaste,
    handleFormDragOver: preventFormDragOver,
    handleOpenHistory,
    historyOpen,
    register,
    submitForm,
    updateMutation,
  };
};
