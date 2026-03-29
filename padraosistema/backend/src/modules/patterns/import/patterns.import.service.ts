import type { PatternInput } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { insertPatternRow } from "../patterns.service";

export const importPatternRowsInTransaction = async (params: {
  database: AppDb;
  inputs: PatternInput[];
  userId: string;
}): Promise<{ created: number }> => {
  return params.database.transaction(async (tx) => {
    const count = await params.inputs.reduce<Promise<number>>(
      async (previous, input) => {
        const prior = await previous;
        await insertPatternRow({
          database: tx,
          input,
          userId: params.userId,
          version: 1,
        });
        return prior + 1;
      },
      Promise.resolve(0),
    );
    return { created: count };
  });
};
