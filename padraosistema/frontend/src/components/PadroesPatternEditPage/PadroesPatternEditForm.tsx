import type { Pattern, PatternInput } from "@padraosistema/lib";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useDeletePatternMutation, useUpdatePatternMutation } from "~/api/patterns.hooks";
import { uploadPatternImage } from "~/api/patterns";
import { MarkdownEditor } from "~/components/MarkdownEditor";
import { PATTERN_CATEGORY_LABELS, PATTERN_CATEGORY_SLUGS, isPatternCategorySlug } from "~/constants/patternCategories";
import { PATTERN_STATUS_LABELS, PATTERN_STATUS_ORDER } from "~/constants/patternStatus";

type Props = {
  pattern: Pattern;
};

type FormValues = PatternInput;

const buildCategoryOptions = (category: string): string[] => {
  const extra = PATTERN_CATEGORY_SLUGS.some((slug) => slug === category) ? [] : [category];
  return [...PATTERN_CATEGORY_SLUGS, ...extra];
};

export const PadroesPatternEditForm: React.FC<Props> = ({ pattern }) => {
  const navigate = useNavigate();
  const updateMutation = useUpdatePatternMutation();
  const deleteMutation = useDeletePatternMutation();

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: pattern.title,
      category: pattern.category,
      content: pattern.content,
      status: pattern.status,
    },
  });

  const contentValue = watch("content");

  const handleBack = (): void => {
    void navigate({ to: "/patterns" });
  };

  const handleDelete = async (): Promise<void> => {
    await deleteMutation.mutateAsync(pattern.id);
    handleBack();
  };

  const onSubmit = handleSubmit(async (values) => {
    await updateMutation.mutateAsync({ id: pattern.id, input: values });
  });

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

  const handleContentChange = (val: string): void => {
    setValue("content", val, { shouldDirty: true });
  };

  const handleFormDragOver: React.DragEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
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

  const categoryOptions = buildCategoryOptions(pattern.category);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
        >
          ← Voltar
        </button>
        <h1 className="min-w-0 flex-1 text-xl font-semibold text-white">{pattern.title}</h1>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex max-w-4xl flex-col gap-4"
        onPaste={handleEditorPaste}
        onDrop={handleEditorDrop}
        onDragOver={handleFormDragOver}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label htmlFor="edit-titulo" className="text-sm text-slate-300">
              Título
            </label>
            <input
              id="edit-titulo"
              type="text"
              className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              {...register("title", { required: true })}
            />
          </div>
          <div className="flex min-w-64 flex-col gap-2">
            <label htmlFor="edit-categoria" className="text-sm text-slate-300">
              Categoria
            </label>
            <select
              id="edit-categoria"
              className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              {...register("category", { required: true })}
            >
              {categoryOptions.map((slug) => (
                <option key={slug} value={slug}>
                  {isPatternCategorySlug(slug) ? PATTERN_CATEGORY_LABELS[slug] : slug}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-64 flex-col gap-2">
            <label htmlFor="edit-status" className="text-sm text-slate-300">
              Status
            </label>
            <select
              id="edit-status"
              className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
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
        <div className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Descrição (Markdown)</span>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <MarkdownEditor value={contentValue ?? ""} onChange={handleContentChange} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            disabled={updateMutation.isPending}
          >
            Salvar alterações
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            disabled={deleteMutation.isPending}
          >
            Excluir
          </button>
        </div>
      </form>
    </div>
  );
};
