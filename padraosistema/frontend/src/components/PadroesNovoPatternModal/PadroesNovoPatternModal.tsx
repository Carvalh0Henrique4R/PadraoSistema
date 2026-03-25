import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import { useForm } from "react-hook-form";
import { useCreatePatternMutation } from "~/api/patterns.hooks";
import { uploadPatternImage } from "~/api/patterns";
import { MarkdownEditor } from "~/components/MarkdownEditor";
import {
  PATTERN_CATEGORY_LABELS,
  PATTERN_CATEGORY_SLUGS,
  type PatternCategorySlug,
} from "~/constants/patternCategories";
import { PATTERN_STATUS_LABELS, PATTERN_STATUS_ORDER } from "~/constants/patternStatus";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = PatternInput;

const defaultCategory: PatternCategorySlug = PATTERN_CATEGORY_SLUGS[0];

export const PadroesNovoPatternModal: React.FC<Props> = ({ open, onClose }) => {
  const createMutation = useCreatePatternMutation();
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: defaultCategory,
      content: "",
      status: "draft",
    },
  });

  const contentValue = watch("content");

  React.useEffect(() => {
    if (!open) {
      reset({
        title: "",
        category: defaultCategory,
        content: "",
        status: "draft",
      });
    }
  }, [open, reset]);

  const handleClose = (): void => {
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
    handleClose();
  });

  const handleBackdropPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleContentChange = (val: string): void => {
    setValue("content", val, { shouldDirty: true });
  };

  const handleFormDragOver: React.DragEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  const handleDialogPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  const handleEditorPaste: React.ClipboardEventHandler<HTMLFormElement> = async (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file == null) continue;

        const { url } = await uploadPatternImage(file);
        const current = contentValue ?? "";
        const next = `${current}\n\n![imagem](${url})`;
        setValue("content", next, { shouldDirty: true });
      }
    }
  };

  const handleEditorDrop: React.DragEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file == null || !file.type.startsWith("image/")) continue;

      const { url } = await uploadPatternImage(file);
      const current = contentValue ?? "";
      const next = `${current}\n\n![imagem](${url})`;
      setValue("content", next, { shouldDirty: true });
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onPointerDown={handleBackdropPointerDown}
      role="presentation"
    >
      <div
        className="flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal
        aria-labelledby="novo-padrao-titulo"
        onPointerDown={handleDialogPointerDown}
      >
        <div className="flex flex-col gap-1 border-b border-white/10 px-6 py-4">
          <h2 id="novo-padrao-titulo" className="text-lg font-semibold text-white">
            Novo padrão
          </h2>
          <p className="text-sm text-slate-400">Preencha os dados para documentar um novo padrão.</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
          onPaste={handleEditorPaste}
          onDrop={handleEditorDrop}
          onDragOver={handleFormDragOver}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="padrao-titulo" className="text-sm text-slate-300">
              Título
            </label>
            <input
              id="padrao-titulo"
              type="text"
              className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              {...register("title", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor="padrao-categoria" className="text-sm text-slate-300">
                Categoria
              </label>
              <select
                id="padrao-categoria"
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                {...register("category", { required: true })}
              >
                {PATTERN_CATEGORY_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {PATTERN_CATEGORY_LABELS[slug]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor="padrao-status" className="text-sm text-slate-300">
                Status
              </label>
              <select
                id="padrao-status"
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                {...register("status", { required: true })}
              >
                {PATTERN_STATUS_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {PATTERN_STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <span className="text-sm text-slate-300">Descrição (Markdown)</span>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10">
              <MarkdownEditor value={contentValue ?? ""} onChange={handleContentChange} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
              disabled={createMutation.isPending}
            >
              Criar padrão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
