import type { ExportHistory, PatternSummary, SystemLogMetadata } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { exportPatternsZip, normalizeExportPatternIds } from "~/modules/export/export.actions";
import { logAction } from "~/modules/logs/log.service";
import { ExportHistoryNotFoundError } from "./export-history.errors";
import {
  insertExportHistoryRecord,
  selectExportHistoryByIdAndUserId,
  selectExportHistoryByUserId,
  selectPatternSummariesByIds,
} from "./export-history.service";

const buildExportLogMetadata = (params: {
  categoriesSample: string | null;
  patternCount: number;
}): SystemLogMetadata => {
  if (params.categoriesSample != null) {
    return { categoriesSample: params.categoriesSample, patternCount: params.patternCount };
  }
  return { patternCount: params.patternCount };
};

export const recordExportHistory = async (params: {
  database: AppDb;
  patternIds: string[];
  userId: string;
}): Promise<void> => {
  const patternIds = normalizeExportPatternIds(params.patternIds);
  const historyId = await insertExportHistoryRecord({
    database: params.database,
    patternIds,
    userId: params.userId,
  });
  const summaries =
    patternIds.length > 0
      ? await selectPatternSummariesByIds({
          database: params.database,
          ids: patternIds,
        })
      : [];
  const uniqueCategories = Array.from(new Set(summaries.map((s) => s.category))).slice(0, 20);
  const categoriesSample = uniqueCategories.length > 0 ? uniqueCategories.join(",") : null;
  await logAction({
    action: "EXPORT_PATTERNS",
    database: params.database,
    entity: "export",
    entityId: historyId,
    metadata: buildExportLogMetadata({ categoriesSample, patternCount: patternIds.length }),
    userId: params.userId,
  });
};

const unavailablePatternSummary = (id: string): PatternSummary => {
  return {
    category: "—",
    id,
    status: "—",
    title: "Padrão indisponível",
  };
};

const collectUniquePatternIds = (historyRows: { patternIds: string[] }[]): string[] => {
  const set = new Set<string>();
  historyRows.forEach((row) => {
    row.patternIds.forEach((id) => {
      set.add(id);
    });
  });
  return Array.from(set);
};

const buildSummaryMap = (rows: { category: string; id: string; status: string; title: string }[]): Map<string, PatternSummary> => {
  const entries = rows.map((r) => [r.id, { category: r.category, id: r.id, status: r.status, title: r.title }] as const);
  return new Map(entries);
};

const mapRowToExportHistory = (params: {
  patternSummaryById: Map<string, PatternSummary>;
  row: { createdAt: Date; id: string; patternIds: string[] };
}): ExportHistory => {
  const patterns = params.row.patternIds.map((pid) => {
    return params.patternSummaryById.get(pid) ?? unavailablePatternSummary(pid);
  });
  return {
    createdAt: params.row.createdAt.toISOString(),
    id: params.row.id,
    patterns,
  };
};

export const listExportHistoryEntries = async (params: {
  database: AppDb;
  userId: string;
}): Promise<ExportHistory[]> => {
  const rows = await selectExportHistoryByUserId({
    database: params.database,
    userId: params.userId,
  });
  const uniqueIds = collectUniquePatternIds(rows);
  const summaryRows = await selectPatternSummariesByIds({
    database: params.database,
    ids: uniqueIds,
  });
  const patternSummaryById = buildSummaryMap(summaryRows);
  return rows.map((row) => mapRowToExportHistory({ patternSummaryById, row }));
};

export const reexportZipFromHistory = async (params: {
  database: AppDb;
  historyId: string;
  userId: string;
}): Promise<Uint8Array> => {
  const row = await selectExportHistoryByIdAndUserId({
    database: params.database,
    historyId: params.historyId,
    userId: params.userId,
  });
  if (row == null) {
    throw new ExportHistoryNotFoundError();
  }
  const bytes = await exportPatternsZip({
    database: params.database,
    patternIds: row.patternIds,
  });
  const normalizedIds = normalizeExportPatternIds(row.patternIds);
  await insertExportHistoryRecord({
    database: params.database,
    patternIds: normalizedIds,
    userId: params.userId,
  });
  await logAction({
    action: "REEXPORT_PATTERNS",
    database: params.database,
    entity: "export",
    entityId: params.historyId,
    metadata: { patternCount: normalizedIds.length },
    userId: params.userId,
  });
  return bytes;
};
