import type { PatternInput } from "@padraosistema/lib";
import path from "node:path";
import type { AppDb } from "~/db/index";
import { logAction } from "~/modules/logs/log.service";
import { normalizeImportStatus } from "../import/patterns.import.schema";
import { parseMarkdownPatternFile } from "./import-markdown.parser";
import { persistImportedMarkdownPatterns } from "./import-markdown.service";

export const MAX_MARKDOWN_IMPORT_FILES = 10;
export const MAX_MARKDOWN_IMPORT_BYTES = 1024 * 1024;
const TITLE_MAX_LENGTH = 500;
const FILES_METADATA_MAX_LENGTH = 400;

const stripControlChars = (value: string): string => {
  return value
    .split("")
    .filter((ch) => {
      const code = ch.codePointAt(0);
      if (code == null) {
        return false;
      }
      if (ch === "\t") {
        return true;
      }
      return code >= 32;
    })
    .join("")
    .trim();
};

const allowedMarkdownExtension = (name: string): boolean => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".md")) {
    return true;
  }
  return lower.endsWith(".mdc");
};

const defaultTitleFromFile = (file: File): string => {
  const base = path.basename(file.name);
  const withoutExt = base.replace(/\.(md|mdc)$/i, "");
  const cleaned = stripControlChars(withoutExt);
  if (cleaned.length === 0) {
    return "importado";
  }
  if (cleaned.length > TITLE_MAX_LENGTH) {
    return cleaned.slice(0, TITLE_MAX_LENGTH);
  }
  return cleaned;
};

const safeBasenameForLog = (file: File): string => {
  const base = stripControlChars(path.basename(file.name));
  return base.length > 0 ? base : "file";
};

const joinNamesForMetadata = (names: string[]): string => {
  const joined = names.join(",");
  if (joined.length <= FILES_METADATA_MAX_LENGTH) {
    return joined;
  }
  return `${joined.slice(0, FILES_METADATA_MAX_LENGTH)}…`;
};

const mapParsedToPatternInput = (
  parsed: ReturnType<typeof parseMarkdownPatternFile>,
  status: NonNullable<ReturnType<typeof normalizeImportStatus>>,
): PatternInput | null => {
  const content = parsed.content.trim();
  const title = stripControlChars(parsed.title);
  if (content.length === 0 || title.length === 0) {
    return null;
  }
  const category = stripControlChars(parsed.category);
  if (category.length === 0) {
    return null;
  }
  return {
    category,
    content,
    status,
    title: title.length > TITLE_MAX_LENGTH ? title.slice(0, TITLE_MAX_LENGTH) : title,
  };
};

type ParseFailure = { index: number; message: string; ok: false };
type ParseSuccess = { input: PatternInput; ok: true };

const validateMarkdownFileLimits = (file: File, index: number): ParseFailure | null => {
  if (!allowedMarkdownExtension(file.name)) {
    return { index, message: "Extensão inválida. Use .md ou .mdc.", ok: false };
  }
  if (file.size === 0) {
    return { index, message: "Arquivo vazio.", ok: false };
  }
  if (file.size > MAX_MARKDOWN_IMPORT_BYTES) {
    return { index, message: "Arquivo excede o tamanho máximo permitido.", ok: false };
  }
  return null;
};

const parseSingleMarkdownFile = async (file: File, index: number): Promise<ParseFailure | ParseSuccess> => {
  const limitErr = validateMarkdownFileLimits(file, index);
  if (limitErr != null) {
    return limitErr;
  }
  const defaultTitle = defaultTitleFromFile(file);
  const rawText = await file.text();
  const parsed = parseMarkdownPatternFile({ defaultTitle, rawText });
  const status = normalizeImportStatus(parsed.status);
  if (status == null) {
    return { index, message: "Status inválido para o padrão importado.", ok: false };
  }
  const input = mapParsedToPatternInput(parsed, status);
  if (input == null) {
    return { index, message: "Título, categoria ou conteúdo inválido após importar o arquivo.", ok: false };
  }
  return { input, ok: true };
};

type CollectParams = { acc: PatternInput[]; files: File[]; index: number };

const collectPatternInputs = async (
  params: CollectParams,
): Promise<{ inputs: PatternInput[]; ok: true } | ParseFailure> => {
  const { acc, files, index } = params;
  if (index >= files.length) {
    return { inputs: acc, ok: true };
  }
  const current = files.at(index);
  if (current == null) {
    return { index, message: "Arquivo ausente.", ok: false };
  }
  const step = await parseSingleMarkdownFile(current, index);
  if (!step.ok) {
    return step;
  }
  return collectPatternInputs({ acc: acc.concat([step.input]), files, index: index + 1 });
};

export const importMarkdownPatternsForUser = async (params: {
  database: AppDb;
  files: File[];
  userId: string;
}): Promise<
  | { created: number; ok: true }
  | { index: number; message: string; ok: false }
  | { message: string; ok: false }
> => {
  if (params.files.length === 0) {
    return { message: "Envie pelo menos um arquivo.", ok: false };
  }
  if (params.files.length > MAX_MARKDOWN_IMPORT_FILES) {
    return { message: "No máximo 10 arquivos por importação.", ok: false };
  }
  const collected = await collectPatternInputs({ acc: [], files: params.files, index: 0 });
  if (!collected.ok) {
    return collected;
  }
  const result = await persistImportedMarkdownPatterns({
    database: params.database,
    inputs: collected.inputs,
    userId: params.userId,
  });
  const logNames = params.files.map(safeBasenameForLog);
  await logAction({
    action: "IMPORT_MARKDOWN_PATTERNS",
    database: params.database,
    entity: "import",
    entityId: null,
    metadata: { count: result.created, files: joinNamesForMetadata(logNames) },
    userId: params.userId,
  });
  return { created: result.created, ok: true };
};
