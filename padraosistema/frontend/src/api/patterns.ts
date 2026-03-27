import type { Pattern, PatternInput, PatternVersionDetail, PatternVersionListItem } from "@padraosistema/lib";
import { raise } from "@padraosistema/lib";
import { apiFetch } from "./client.util";
import {
  patternApiSchema,
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

export const getPatternVersion = async (
  patternId: string,
  version: number,
): Promise<PatternVersionDetail> => {
  const data = await apiFetch(`/api/patterns/${patternId}/versions/${String(version)}`);
  const parsed = patternVersionDetailApiSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta da versão do padrão inválida");
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
