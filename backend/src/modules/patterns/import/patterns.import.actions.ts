import type { AppDb } from "~/db/index";
import { logAction } from "~/modules/logs/log.service";
import { parsePatternImportRequest } from "./patterns.import.schema";
import { importPatternRowsInTransaction } from "./patterns.import.service";

export const parsePatternImportBody = parsePatternImportRequest;

export const importPatternsForUser = async (params: {
  body: unknown;
  database: AppDb;
  userId: string;
}): Promise<
  | { created: number; ok: true }
  | { index?: number; message: string; ok: false }
> => {
  const parsed = parsePatternImportRequest(params.body);
  if (!parsed.ok) {
    return { index: parsed.index, message: parsed.message, ok: false };
  }
  const result = await importPatternRowsInTransaction({
    database: params.database,
    inputs: parsed.items,
    userId: params.userId,
  });
  await logAction({
    action: "IMPORT_PATTERNS",
    database: params.database,
    entity: "import",
    entityId: null,
    metadata: { count: result.created },
    userId: params.userId,
  });
  return { created: result.created, ok: true };
};
