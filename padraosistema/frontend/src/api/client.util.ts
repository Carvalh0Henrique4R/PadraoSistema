import { tryCatchAsync } from "@padraosistema/lib";
import { z } from "zod";
import { env } from "../env/env";

const errorResponseSchema = z.object({
  message: z.unknown().optional(),
});

const CSRF_COOKIE_NAMES = ["csrf-token", "XSRF-TOKEN", "_csrf", "csrfToken"];
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const getCookie = (name: string): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

const getCsrfToken = (): string | undefined => {
  const found = CSRF_COOKIE_NAMES.map(getCookie).find((v) => v != null);
  if (found == null) {
    return undefined;
  }
  return decodeURIComponent(found);
};

const applyJsonContentType = (headers: Headers, init: RequestInit | undefined): void => {
  const body = init?.body;
  const isFormData = body instanceof FormData;
  if (isFormData) {
    return;
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
};

const applyCsrfHeader = (headers: Headers, method: string): void => {
  if (!MUTATION_METHODS.has(method)) {
    return;
  }
  const token = getCsrfToken();
  if (token != null && !headers.has("X-CSRF-Token")) {
    headers.set("X-CSRF-Token", token);
  }
};

const buildHeaders = (init: RequestInit | undefined, method: string): Headers => {
  const headers = new Headers(init?.headers);
  applyJsonContentType(headers, init);
  applyCsrfHeader(headers, method);
  return headers;
};

const parseErrorMessage = async (response: Response, isJson: boolean): Promise<string> => {
  const [body] = isJson ? await tryCatchAsync<unknown>(() => response.json()) : [null];
  const parsed = errorResponseSchema.safeParse(body);
  if (parsed.success && parsed.data.message != null) {
    const msg = parsed.data.message;
    if (typeof msg === "string") {
      return msg;
    }
    return JSON.stringify(msg);
  }
  return response.statusText;
};

const normalizeApiBase = (base: string): string => base.replace(/\/$/, "");

const resolveBrowserApiBase = (): string => {
  if (typeof window !== "undefined") {
    return normalizeApiBase(window.location.origin);
  }
  return normalizeApiBase(env.VITE_BACKEND_URL);
};

type FetchJsonWithBaseParams = {
  base: string;
  init?: RequestInit;
  path: string;
};

const fetchJsonWithBase = async (params: FetchJsonWithBaseParams): Promise<unknown> => {
  const { base, path, init } = params;
  const url = `${normalizeApiBase(base)}${path}`;
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = buildHeaders(init, method);

  const response = await fetch(url, {
    credentials: "include",
    headers,
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response, isJson);
    throw new Error(`Request failed ${String(response.status)}: ${errorMessage}`);
  }

  if (!isJson) {
    return null;
  }

  return response.json();
};

export const apiFetch = async (path: string, init?: RequestInit): Promise<unknown> => {
  return fetchJsonWithBase({ base: resolveBrowserApiBase(), path, init });
};

export const apiFetchSameOrigin = apiFetch;
