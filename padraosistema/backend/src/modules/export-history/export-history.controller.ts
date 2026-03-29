import { Hono } from "hono";
import { tryCatchAsync } from "@padraosistema/lib";
import { requireAuth } from "~/middlewares/requireAuth";
import type { ExportRouteAuthOptions } from "~/modules/export/export.routeOptions";
import type { AppVariables } from "~/types/app";
import { ExportPatternsInvalidSelectionError } from "~/modules/export/export.errors";
import { listExportHistoryEntries, reexportZipFromHistory } from "./export-history.actions";
import { ExportHistoryNotFoundError } from "./export-history.errors";
import { exportRetryRequestSchema, firstZodMessage } from "./export-history.schema";

export const registerExportHistoryRoutes = (
  app: Hono<{ Variables: AppVariables }>,
  options?: ExportRouteAuthOptions,
): void => {
  const authenticate = options?.authenticate ?? requireAuth;

  app.get("/history", authenticate, async (c) => {
    const database = c.get("db");
    const user = c.get("user");
    if (user == null) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const entries = await listExportHistoryEntries({
      database,
      userId: user.id,
    });
    return c.json(entries);
  });

  app.post("/retry", authenticate, async (c) => {
    const database = c.get("db");
    const user = c.get("user");
    if (user == null) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const [jsonBody, jsonErr] = await tryCatchAsync(() => c.req.json());
    if (jsonErr != null) {
      return c.json({ message: "Corpo da requisição inválido" }, 400);
    }
    const parsed = exportRetryRequestSchema.safeParse(jsonBody);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const [bytes, zipErr] = await tryCatchAsync(() =>
      reexportZipFromHistory({
        database,
        historyId: parsed.data.historyId,
        userId: user.id,
      }),
    );
    if (zipErr != null) {
      if (zipErr instanceof ExportHistoryNotFoundError) {
        return c.json({ message: "Histórico não encontrado" }, 404);
      }
      if (zipErr instanceof ExportPatternsInvalidSelectionError) {
        return c.json({ message: "Lista de padrões inválida" }, 400);
      }
      throw zipErr;
    }
    const zipBody = new Uint8Array(bytes);
    return new Response(zipBody, {
      headers: {
        "Content-Disposition": 'attachment; filename="patterns.zip"',
        "Content-Type": "application/zip",
      },
      status: 200,
    });
  });
};
