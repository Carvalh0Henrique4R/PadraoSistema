import type { PatternInput } from "@padraosistema/lib";
import type { ClipboardEvent, DragEvent } from "react";
import React from "react";
import type { UseFormRegister } from "react-hook-form";
import type { FormSubmitEvent } from "~/types/formSubmitEvent";
import { NovoPatternModalCategoryStatusRow } from "./NovoPatternModalCategoryStatusRow";
import { NovoPatternModalFooterActions } from "./NovoPatternModalFooterActions";
import { NovoPatternModalMarkdownSection } from "./NovoPatternModalMarkdownSection";
import { NovoPatternModalTitleField } from "./NovoPatternModalTitleField";

type Props = {
  contentValue: string;
  createMutationPending: boolean;
  handleClose: () => void;
  handleContentChange: (val: string) => void;
  onDragOver: (event: DragEvent<HTMLFormElement>) => void;
  onDrop: (event: DragEvent<HTMLFormElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLFormElement>) => void;
  register: UseFormRegister<PatternInput>;
  submitForm: (event: FormSubmitEvent) => void;
};

export const NovoPatternModalFormFields: React.FC<Props> = ({
  contentValue,
  createMutationPending,
  handleClose,
  handleContentChange,
  onDragOver,
  onDrop,
  onPaste,
  register,
  submitForm,
}) => {
  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPaste={onPaste}
      onSubmit={submitForm}
    >
      <NovoPatternModalTitleField register={register} />
      <NovoPatternModalCategoryStatusRow register={register} />
      <NovoPatternModalMarkdownSection contentValue={contentValue} onContentChange={handleContentChange} />
      <NovoPatternModalFooterActions createMutationPending={createMutationPending} onCancel={handleClose} />
    </form>
  );
};
