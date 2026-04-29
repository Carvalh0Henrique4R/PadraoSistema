import type { PatternInput, PatternStatus } from "@padraosistema/lib";
import { z } from "zod";
import { firstZodMessage } from "../patterns.schema";

export const importRequestBodySchema = z.object({ data: z.unknown() }).strict();

const nonEmptyTrimmedString = (field: string) =>
  z.string().refine((value) => value.trim().length > 0, { message: `O campo ${field} é obrigatório` });

const importItemObjectSchema = z
  .object({
    title: nonEmptyTrimmedString("title"),
    category: nonEmptyTrimmedString("category"),
    status: nonEmptyTrimmedString("status"),
    description: nonEmptyTrimmedString("description"),
  })
  .strict();

const importStatusLookup: Readonly<Record<string, PatternStatus>> = {
  deprecada: "deprecated",
  deprecated: "deprecated",
  depreciado: "deprecated",
  draft: "draft",
  estavel: "stable",
  estável: "stable",
  obsoleto: "deprecated",
  rascunho: "draft",
  review: "review",
  revisao: "review",
  revisão: "review",
  stable: "stable",
};

const normalizeImportStatusToken = (raw: string): string => raw.trim().toLowerCase();

export const normalizeImportStatus = (raw: string): PatternStatus | null => {
  const key = normalizeImportStatusToken(raw);
  const resolved = importStatusLookup[key];
  return resolved ?? null;
};

export const normalizeImportDataField = (data: unknown): unknown[] | null => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data !== null && typeof data === "object") {
    return [data];
  }
  return null;
};

const mapParsedItemToPatternInput = (parsed: z.infer<typeof importItemObjectSchema>): PatternInput | null => {
  const status = normalizeImportStatus(parsed.status);
  if (status == null) {
    return null;
  }
  return {
    category: parsed.category.trim(),
    content: parsed.description.trim(),
    status,
    title: parsed.title.trim(),
  };
};

const validateImportItemsFromIndex = (
  items: unknown[],
  index: number,
  acc: PatternInput[],
): { ok: true; items: PatternInput[] } | { ok: false; index: number; message: string } => {
  if (index >= items.length) {
    return { items: acc, ok: true };
  }
  const raw = items[index];
  const parsed = importItemObjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { index, message: firstZodMessage(parsed.error), ok: false };
  }
  const input = mapParsedItemToPatternInput(parsed.data);
  if (input == null) {
    return { index, message: "Status inválido para o padrão importado.", ok: false };
  }
  return validateImportItemsFromIndex(items, index + 1, acc.concat([input]));
};

export const validateImportItemsArray = (
  items: unknown[],
): { ok: true; items: PatternInput[] } | { ok: false; index: number; message: string } => {
  if (items.length === 0) {
    return { index: 0, message: "Informe pelo menos um padrão para importar.", ok: false };
  }
  return validateImportItemsFromIndex(items, 0, []);
};

export const parsePatternImportRequest = (
  body: unknown,
):
  | { ok: true; items: PatternInput[] }
  | { ok: false; message: string; index?: number } => {
  const wrapped = importRequestBodySchema.safeParse(body);
  if (!wrapped.success) {
    return { message: firstZodMessage(wrapped.error), ok: false };
  }
  const normalized = normalizeImportDataField(wrapped.data.data);
  if (normalized == null) {
    return {
      message: "Formato de dados inválido. Use um objeto ou um array de padrões.",
      ok: false,
    };
  }
  const itemsResult = validateImportItemsArray(normalized);
  if (!itemsResult.ok) {
    return { index: itemsResult.index, message: itemsResult.message, ok: false };
  }
  return { items: itemsResult.items, ok: true };
};
