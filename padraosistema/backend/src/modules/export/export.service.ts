import { isPatternCategorySlug, PATTERN_CATEGORY_LABELS, raise } from "@padraosistema/lib";
import JSZip from "jszip";
import { patternStatusSchema } from "~/modules/patterns/patterns.schema";
import type { PatternRow } from "~/modules/patterns/patterns.service";

export const categoryDisplayTitle = (category: string): string => {
  if (isPatternCategorySlug(category)) {
    return PATTERN_CATEGORY_LABELS[category];
  }
  return category;
};

const SPECIAL_SLUG_CHARS = new Set(["_", "-", "."]);

const isAsciiLetterOrDigit = (code: number): boolean => {
  if (code >= 48 && code <= 57) {
    return true;
  }
  if (code >= 65 && code <= 90) {
    return true;
  }
  return code >= 97 && code <= 122;
};

const isWordChar = (ch: string): boolean => {
  if (SPECIAL_SLUG_CHARS.has(ch)) {
    return true;
  }
  const code = ch.codePointAt(0);
  if (code == null) {
    return false;
  }
  return isAsciiLetterOrDigit(code);
};

const trimUnderscores = (value: string): string => {
  const chars = [...value];
  let start = 0;
  let end = chars.length;
  while (start < end && chars[start] === "_") {
    start += 1;
  }
  while (end > start && chars[end - 1] === "_") {
    end -= 1;
  }
  return chars.slice(start, end).join("");
};

export const sanitizeCategoryBasename = (category: string): string => {
  const noDotDot = category.split("..").join("");
  const withHyphens = noDotDot.replaceAll("/", "-").replaceAll("\\", "-");
  const mapped = [...withHyphens]
    .map((ch) => {
      if (ch === "-") {
        return ch;
      }
      if (isWordChar(ch)) {
        return ch;
      }
      return "_";
    })
    .join("");
  const trimmed = trimUnderscores(mapped);
  const base = trimmed.length > 0 ? trimmed.slice(0, 120) : "uncategorized";
  return base.length > 0 ? base : "uncategorized";
};

export const categoriesInRowOrder = (rows: PatternRow[]): string[] => {
  const seen = new Set<string>();
  return rows.reduce<string[]>((acc, row) => {
    if (seen.has(row.category)) {
      return acc;
    }
    seen.add(row.category);
    return [...acc, row.category];
  }, []);
};

export const assignMdcFilenames = (categories: string[]): Map<string, string> => {
  const usedBasenames = new Map<string, number>();
  const result = new Map<string, string>();
  categories.forEach((raw) => {
    const base = sanitizeCategoryBasename(raw);
    const count = usedBasenames.get(base) ?? 0;
    usedBasenames.set(base, count + 1);
    const suffix = count === 0 ? "" : `_${String(count)}`;
    result.set(raw, `${base}${suffix}.mdc`);
  });
  return result;
};

const formatPatternBlock = (row: PatternRow): string => {
  const parsed = patternStatusSchema.safeParse(row.status);
  const statusLabel = parsed.success ? parsed.data : "draft";
  return [
    `## Pattern: ${row.title}`,
    "",
    `Versão: ${String(row.version)}`,
    `Status: ${statusLabel}`,
    "",
    row.content,
    "",
    "---",
  ].join("\n");
};

export const buildMdcForCategory = (params: { categoryKey: string; rowsInOrder: PatternRow[] }): string => {
  const heading = categoryDisplayTitle(params.categoryKey);
  const inCategory = params.rowsInOrder.filter((row) => row.category === params.categoryKey);
  const blocks = inCategory.map((row) => formatPatternBlock(row));
  const body = blocks.join("\n\n");
  return [`# ${heading}`, "", body].join("\n");
};

export const buildZipEntriesFromRows = (orderedRows: PatternRow[]): { body: string; filename: string }[] => {
  const catOrder = categoriesInRowOrder(orderedRows);
  const names = assignMdcFilenames(catOrder);
  return catOrder.map((cat) => {
    const filename = names.get(cat) ?? raise("missing filename for category");
    const body = buildMdcForCategory({ categoryKey: cat, rowsInOrder: orderedRows });
    return { body, filename };
  });
};

export const buildExportZipBytes = async (orderedRows: PatternRow[]): Promise<Uint8Array> => {
  const zip = new JSZip();
  buildZipEntriesFromRows(orderedRows).forEach((entry) => {
    zip.file(entry.filename, entry.body);
  });
  const generated = await zip.generateAsync({ type: "uint8array" });
  return generated;
};
