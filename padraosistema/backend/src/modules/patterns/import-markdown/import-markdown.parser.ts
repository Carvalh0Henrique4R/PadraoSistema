import type { ImportedMarkdownPattern } from "@padraosistema/lib";

const DEFAULT_CATEGORY = "Importado";
const DEFAULT_STATUS = "draft";

const splitLines = (raw: string): string[] => raw.split(/\r?\n/);

const findFrontMatterEndIndex = (lines: string[]): number => {
  if (lines.length === 0 || lines[0] !== "---") {
    return -1;
  }
  const withoutFirst = lines.slice(1);
  const relativeClose = withoutFirst.findIndex((line) => line === "---");
  return relativeClose === -1 ? -1 : relativeClose + 1;
};

const parseFrontMatterLine = (line: string): { key: string; value: string } | null => {
  const colon = line.indexOf(":");
  if (colon <= 0) {
    return null;
  }
  const key = line.slice(0, colon).trim().toLowerCase();
  const value = line.slice(colon + 1).trim();
  if (key.length === 0) {
    return null;
  }
  return { key, value };
};

type FrontFields = {
  category: string | undefined;
  status: string | undefined;
  title: string | undefined;
};

const emptyFrontFields = (): FrontFields => ({
  category: undefined,
  status: undefined,
  title: undefined,
});

const mergeFrontField = (acc: FrontFields, parsed: { key: string; value: string }): FrontFields => {
  if (parsed.key === "title") {
    return { ...acc, title: parsed.value };
  }
  if (parsed.key === "category") {
    return { ...acc, category: parsed.value };
  }
  if (parsed.key === "status") {
    return { ...acc, status: parsed.value };
  }
  return acc;
};

const extractFrontMatterFields = (lines: string[]): FrontFields => {
  return lines.reduce<FrontFields>((acc, line) => {
    const parsed = parseFrontMatterLine(line);
    if (parsed == null) {
      return acc;
    }
    return mergeFrontField(acc, parsed);
  }, emptyFrontFields());
};

const splitFrontMatter = (raw: string): { body: string; frontLines: string[] | null } => {
  const lines = splitLines(raw);
  const endIdx = findFrontMatterEndIndex(lines);
  if (endIdx === -1) {
    return { body: raw, frontLines: null };
  }
  const frontLines = lines.slice(1, endIdx);
  const bodyLines = lines.slice(endIdx + 1);
  const body = bodyLines.join("\n");
  return { body, frontLines };
};

const resolveTitle = (fields: FrontFields, defaultTitle: string): string => {
  const t = fields.title;
  if (t != null && t.trim().length > 0) {
    return t.trim();
  }
  return defaultTitle;
};

const resolveCategory = (fields: FrontFields): string => {
  const c = fields.category;
  if (c != null && c.trim().length > 0) {
    return c.trim();
  }
  return DEFAULT_CATEGORY;
};

const resolveStatus = (fields: FrontFields): string => {
  const s = fields.status;
  if (s != null && s.trim().length > 0) {
    return s.trim();
  }
  return DEFAULT_STATUS;
};

export const parseMarkdownPatternFile = (params: {
  defaultTitle: string;
  rawText: string;
}): ImportedMarkdownPattern => {
  const { body, frontLines } = splitFrontMatter(params.rawText);
  const fields = frontLines == null ? emptyFrontFields() : extractFrontMatterFields(frontLines);
  return {
    category: resolveCategory(fields),
    content: body,
    status: resolveStatus(fields),
    title: resolveTitle(fields, params.defaultTitle),
  };
};
