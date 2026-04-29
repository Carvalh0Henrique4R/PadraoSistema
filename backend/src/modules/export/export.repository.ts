import { inArray } from "drizzle-orm";
import type { AppDb } from "~/db/index";
import { patterns } from "~/db/schema/patterns";
import type { PatternRow } from "~/modules/patterns/patterns.service";

export const findPatternsByIds = async (params: { database: AppDb; ids: string[] }): Promise<PatternRow[]> => {
  if (params.ids.length === 0) {
    return [];
  }
  return params.database.select().from(patterns).where(inArray(patterns.id, params.ids));
};
