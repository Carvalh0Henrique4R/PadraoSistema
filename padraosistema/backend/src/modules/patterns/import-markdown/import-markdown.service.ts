import type { PatternInput } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { importPatternRowsInTransaction } from "../import/patterns.import.service";

export const persistImportedMarkdownPatterns = async (params: {
  database: AppDb;
  inputs: PatternInput[];
  userId: string;
}): Promise<{ created: number }> => {
  return importPatternRowsInTransaction({
    database: params.database,
    inputs: params.inputs,
    userId: params.userId,
  });
};
