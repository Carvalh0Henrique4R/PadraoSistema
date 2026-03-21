import { apiFetch } from "./client.util";
import type { Pattern, PatternInput } from "@padraosistema/lib";

const CSRF_COOKIE_NAMES = ["csrf-token", "XSRF-TOKEN", "_csrf", "csrfToken"] as const;

const getCookie = (name: string): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

const getCsrfToken = (): string | undefined => {
  const found = CSRF_COOKIE_NAMES.map(getCookie).find((v) => v != null);
  if (found == null) return undefined;
  return decodeURIComponent(found);
};

export const listPatterns = async (): Promise<Pattern[]> => {
  const data = (await apiFetch("/api/patterns")) as Pattern[];
  return data;
};

export const getPattern = async (id: string): Promise<Pattern> => {
  const data = (await apiFetch(`/api/patterns/${id}`)) as Pattern;
  return data;
};

export const createPattern = async (input: PatternInput): Promise<Pattern> => {
  const data = (await apiFetch("/api/patterns", {
    method: "POST",
    body: JSON.stringify(input),
  })) as Pattern;
  return data;
};

export const updatePattern = async (id: string, input: PatternInput): Promise<Pattern> => {
  const data = (await apiFetch(`/api/patterns/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })) as Pattern;
  return data;
};

export const deletePattern = async (id: string): Promise<void> => {
  await apiFetch(`/api/patterns/${id}`, {
    method: "DELETE",
  });
};

export const uploadPatternImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const csrfToken = getCsrfToken();

  const response = await fetch("/api/patterns/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: csrfToken != null ? { "X-CSRF-Token": csrfToken } : undefined,
  });

  if (!response.ok) {
    throw new Error("Falha ao fazer upload da imagem");
  }

  const data = (await response.json()) as { url: string };
  return data;
};
