import { raise } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import type { PatternRow } from "~/modules/patterns/patterns.service";
import { ExportPatternsInvalidSelectionError } from "./export.errors";
import { findPatternsByIds } from "./export.repository";
import { buildExportZipBytes } from "./export.service";

const orderRowsByIds = (params: { ids: string[]; rows: PatternRow[] }): PatternRow[] => {
  const byId = new Map(params.rows.map((row) => [row.id, row]));
  return params.ids.map((id) => byId.get(id) ?? raise("missing pattern row"));
};

export const normalizeExportPatternIds = (patternIds: string[]): string[] => {
  return Array.from(new Set(patternIds));
};

export const exportPatternsZip = async (params: {
  database: AppDb;
  patternIds: string[];
}): Promise<Uint8Array> => {
  const uniqueIds = normalizeExportPatternIds(params.patternIds);
  const rows = await findPatternsByIds({
    database: params.database,
    ids: uniqueIds,
  });
  if (rows.length !== uniqueIds.length) {
    throw new ExportPatternsInvalidSelectionError();
  }
  const ordered = orderRowsByIds({ ids: uniqueIds, rows });
  return buildExportZipBytes(ordered);
};
