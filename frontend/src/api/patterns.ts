import type { Pattern, PatternInput, PatternVersionDetail, PatternVersionListItem } from "@padraosistema/lib";
import { objectEntries, raise } from "@padraosistema/lib";
import { apiFetch } from "./client.util";
import {
  patternApiSchema,
  patternImportResponseSchema,
  patternListApiSchema,
  patternVersionDetailApiSchema,
  patternVersionListApiSchema,
  uploadResponseSchema,
} from "./pattern.schemas";

export const listPatterns = async (): Promise<Pattern[]> => {
  const data = await apiFetch("/api/patterns");
  const parsed = patternListApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta da lista de padrões inválida");
  }
  return parsed.data;
};

export const getPattern = async (id: string): Promise<Pattern> => {
  const data = await apiFetch(`/api/patterns/${id}`);
  const parsed = patternApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta do padrão inválida");
  }
  return parsed.data;
};

export const importPatternsMarkdown = async (files: File[]): Promise<{ created: number; success: true }> => {
  const formData = files.reduce((acc, file) => {
    acc.append("file", file);
    return acc;
  }, new FormData());
  const res = await apiFetch("/api/patterns/import/markdown", {
    body: formData,
    method: "POST",
  });
  const parsed = patternImportResponseSchema.safeParse(res);
  if (!parsed.success) {
    throw new Error("Resposta de importação Markdown inválida");
  }
  return parsed.data;
};

const buildPatternImportRequestBody = (payload: unknown): { data: unknown } => {
  if (payload === null) {
    return { data: payload };
  }
  if (typeof payload !== "object") {
    return { data: payload };
  }
  if (Array.isArray(payload)) {
    return { data: payload };
  }
  const entries = objectEntries(payload);
  if (entries.length === 1) {
    const first = entries[0];
    if (first[0] === "data") {
      return { data: first[1] };
    }
  }
  return { data: payload };
};

export const importPatterns = async (payload: unknown): Promise<{ created: number; success: true }> => {
  const bodyObject = buildPatternImportRequestBody(payload);
  const res = await apiFetch("/api/patterns/import", {
    body: JSON.stringify(bodyObject),
    method: "POST",
  });
  const parsed = patternImportResponseSchema.safeParse(res);
  if (!parsed.success) {
    throw new Error("Resposta de importação inválida");
  }
  return parsed.data;
};

export const createPattern = async (input: PatternInput): Promise<Pattern> => {
  const data = await apiFetch("/api/patterns", {
    body: JSON.stringify(input),
    method: "POST",
  });
  const parsed = patternApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta de criação inválida");
  }
  return parsed.data;
};

export const updatePattern = async (id: string, input: PatternInput): Promise<Pattern> => {
  const data = await apiFetch(`/api/patterns/${id}`, {
    body: JSON.stringify(input),
    method: "PUT",
  });
  const parsed = patternApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta de atualização inválida");
  }
  return parsed.data;
};

export const deletePattern = async (id: string): Promise<void> => {
  await apiFetch(`/api/patterns/${id}`, {
    method: "DELETE",
  });
};

export const listPatternVersions = async (patternId: string): Promise<PatternVersionListItem[]> => {
  const data = await apiFetch(`/api/patterns/${patternId}/versions`);
  const parsed = patternVersionListApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta do histórico de versões inválida");
  }
  return parsed.data;
};

export const getPatternVersion = async (patternId: string, version: number): Promise<PatternVersionDetail> => {
  const data = await apiFetch(`/api/patterns/${patternId}/versions/${String(version)}`);
  const parsed = patternVersionDetailApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta da versão do padrão inválida");
  }
  return parsed.data;
};

export const revertPatternToVersion = async (patternId: string, versionId: string): Promise<Pattern> => {
  const data = await apiFetch(`/api/patterns/${patternId}/revert`, {
    body: JSON.stringify({ versionId }),
    method: "POST",
  });
  const parsed = patternApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta de reversão de versão inválida");
  }
  return parsed.data;
};

export const uploadPatternImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const data = await apiFetch("/api/patterns/upload", {
    body: formData,
    method: "POST",
  });
  const parsed = uploadResponseSchema.safeParse(data);
  if (!parsed.success) {
    return raise("Resposta de upload inválida");
  }
  return parsed.data;
};
