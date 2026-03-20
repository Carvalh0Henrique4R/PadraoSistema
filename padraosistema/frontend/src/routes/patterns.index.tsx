import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Pattern, PatternInput } from "@padraosistema/lib";
import {
  useCreatePatternMutation,
  useDeletePatternMutation,
  usePatternsQuery,
  useUpdatePatternMutation,
} from "~/api/patterns.hooks";
import { MarkdownEditor } from "~/components/MarkdownEditor";
import { uploadPatternImage } from "~/api/patterns";

type FormValues = PatternInput;

const groupByCategory = (patterns: Pattern[]): Record<string, Pattern[]> => {
  return patterns.reduce<Record<string, Pattern[]>>((acc, pattern) => {
    const key = pattern.category || "Sem categoria";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pattern);
    return acc;
  }, {});
};

const PatternsPage = (): ReactNode => {
  const { data: patterns, isLoading, isError } = usePatternsQuery();
  const createMutation = useCreatePatternMutation();
  const updateMutation = useUpdatePatternMutation();
  const deleteMutation = useDeletePatternMutation();

  const [selected, setSelected] = useState<Pattern | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "",
      content: "",
    },
  });

  const contentValue = watch("content");

  const handleSelect = (pattern: Pattern): void => {
    setSelected(pattern);
    reset({
      title: pattern.title,
      category: pattern.category,
      content: pattern.content,
    });
  };

  const handleNew = (): void => {
    setSelected(null);
    reset({
      title: "",
      category: "",
      content: "",
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    if (selected == null) {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync({ id: selected.id, input: values });
    }
    handleNew();
  });

  const handleDelete = async (): Promise<void> => {
    if (selected == null) return;
    await deleteMutation.mutateAsync(selected.id);
    handleNew();
  };

  const handleEditorPaste: React.ClipboardEventHandler<HTMLDivElement> = async (event) => {
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

  const handleEditorDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
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

  if (isLoading) {
    return <div className="p-4 text-white">Carregando padrões...</div>;
  }

  if (isError || patterns == null) {
    return <div className="p-4 text-red-400">Erro ao carregar padrões.</div>;
  }

  const grouped = groupByCategory(patterns);

  return (
    <div className="flex h-full min-h-screen text-white">
      <aside className="w-72 border-r border-gray-700 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Padrões</h2>
          <button
            type="button"
            onClick={handleNew}
            className="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500"
          >
            Novo
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {Object.entries(grouped).map(([category, list]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">{category}</h3>
              <ul className="space-y-1">
                {list.map((pattern) => (
                  <li key={pattern.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(pattern)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        selected?.id === pattern.id ? "bg-blue-700" : "hover:bg-gray-800"
                      }`}
                    >
                      {pattern.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {patterns.length === 0 && (
            <div className="text-sm text-gray-400">Nenhum padrão cadastrado ainda.</div>
          )}
        </div>
      </aside>
      <main className="flex-1 p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {selected == null ? "Novo padrão" : "Editar padrão: ${selected.title}"}
        </h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 max-w-4xl"
          onPaste={handleEditorPaste}
          onDrop={handleEditorDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Título</label>
              <input
                type="text"
                className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                {...register("title", { required: true })}
              />
            </div>
            <div className="w-64">
              <label className="block text-sm mb-1">Categoria</label>
              <input
                type="text"
                className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                placeholder="WorkWithPlus, Mensagens..."
                {...register("category", { required: true })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm">Conteúdo (Markdown)</label>
            <div className="border border-gray-700 rounded overflow-hidden">
              <MarkdownEditor
                value={contentValue ?? ""}
                onChange={(val) => setValue("content", val, { shouldDirty: true })}
              />
            </div>
            <span className="text-xs text-gray-400">
              Você pode colar ou arrastar imagens aqui; elas serão enviadas para o backend e o link
              Markdown será inserido automaticamente.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-sm font-semibold"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {selected == null ? "Criar" : "Salvar alterações"}
            </button>
            {selected != null && (
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-sm font-semibold"
                disabled={deleteMutation.isPending}
              >
                Excluir
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/patterns/")({
  component: PatternsPage,
});

