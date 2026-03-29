import { raise } from "@padraosistema/lib";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { exportHistory, type ExportHistoryRow } from "~/db/schema/export_history";
import { patterns } from "~/db/schema/patterns";

export type PatternSummaryRow = {
  category: string;
  id: string;
  status: string;
  title: string;
};

export const selectPatternSummariesByIds = async (params: {
  database: AppDb;
  ids: string[];
}): Promise<PatternSummaryRow[]> => {
  if (params.ids.length === 0) {
    return [];
  }
  return params.database
    .select({
      category: patterns.category,
      id: patterns.id,
      status: patterns.status,
      title: patterns.title,
    })
    .from(patterns)
    .where(inArray(patterns.id, params.ids));
};

export const insertExportHistoryRecord = async (params: {
  database: AppDb;
  patternIds: string[];
  userId: string;
}): Promise<string> => {
  const inserted = await params.database
    .insert(exportHistory)
    .values({
      patternIds: params.patternIds,
      userId: params.userId,
    })
    .returning({ id: exportHistory.id });
  const row = inserted[0];
  return row?.id ?? raise("missing export history id");
};

export const selectExportHistoryByUserId = async (params: {
  database: AppDb;
  userId: string;
}): Promise<ExportHistoryRow[]> => {
  return params.database
    .select()
    .from(exportHistory)
    .where(eq(exportHistory.userId, params.userId))
    .orderBy(desc(exportHistory.createdAt));
};

export const selectExportHistoryByIdAndUserId = async (params: {
  database: AppDb;
  historyId: string;
  userId: string;
}): Promise<ExportHistoryRow | null> => {
  const rows = await params.database
    .select()
    .from(exportHistory)
    .where(and(eq(exportHistory.id, params.historyId), eq(exportHistory.userId, params.userId)))
    .limit(1);
  const row = rows[0];
  return row ?? null;
};
