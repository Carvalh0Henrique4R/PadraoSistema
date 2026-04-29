import { desc } from "drizzle-orm";
import { z } from "zod";

import { tryCatchAsync } from "@padraosistema/lib";

import { db, exportHistory } from "../db";
import type { McpTool } from "./types";

const listExportHistoryInputSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const exportHistoryTools: readonly McpTool[] = [
  {
    description: "Lista o histórico de exportações ZIP realizadas no sistema.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = listExportHistoryInputSchema.parse(inputRaw);
      const [rows, queryError] = await tryCatchAsync(async () =>
        db
          .select({
            createdAt: exportHistory.createdAt,
            id: exportHistory.id,
            patternIds: exportHistory.patternIds,
            userId: exportHistory.userId,
          })
          .from(exportHistory)
          .orderBy(desc(exportHistory.createdAt))
          .limit(input.limit)
          .offset(input.offset),
      );

      if (queryError !== null) {
        throw queryError;
      }

      return rows.map((row) => ({
        createdAt: row.createdAt.toISOString(),
        id: row.id,
        patternIds: row.patternIds,
        userId: row.userId,
      }));
    },
    inputSchema: listExportHistoryInputSchema,
    name: "list_export_history",
  },
];
