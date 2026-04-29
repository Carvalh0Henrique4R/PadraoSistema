import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { tryCatchAsync } from "@padraosistema/lib";

import { db, systemLogs } from "../db";
import type { McpTool } from "./types";

const listSystemLogsInputSchema = z.object({
  action: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(30),
  offset: z.number().int().min(0).default(0),
});

export const systemLogsTools: readonly McpTool[] = [
  {
    description: "Lista logs de auditoria do sistema. Filtra por ação se fornecido.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = listSystemLogsInputSchema.parse(inputRaw);

      const [rows, queryError] = await tryCatchAsync(async () => {
        const projected = db
          .select({
            action: systemLogs.action,
            createdAt: systemLogs.createdAt,
            entity: systemLogs.entity,
            entityId: systemLogs.entityId,
            id: systemLogs.id,
            metadata: systemLogs.metadata,
            userId: systemLogs.userId,
          })
          .from(systemLogs);

        const filtered =
          typeof input.action === "string" && input.action.length > 0
            ? projected.where(eq(systemLogs.action, input.action)).orderBy(desc(systemLogs.createdAt))
            : projected.orderBy(desc(systemLogs.createdAt));

        return filtered.limit(input.limit).offset(input.offset);
      });

      if (queryError !== null) {
        throw queryError;
      }

      return rows.map((row) => ({
        action: row.action,
        createdAt: row.createdAt.toISOString(),
        entity: row.entity,
        entityId: row.entityId,
        id: row.id,
        metadata: row.metadata,
        userId: row.userId,
      }));
    },
    inputSchema: listSystemLogsInputSchema,
    name: "list_system_logs",
  },
];
