import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { tryCatchAsync } from "@padraosistema/lib";
import { requireAuth } from "~/middlewares/requireAuth";
import type { AppVariables } from "~/types/app";
import { exportPatternsZip } from "./export.actions";
import { ExportPatternsInvalidSelectionError } from "./export.errors";
import { exportRequestSchema, firstZodMessage } from "./export.schema";

export type RegisterExportRoutesOptions = {
  authenticate: MiddlewareHandler<{ Variables: AppVariables }> | undefined;
};

export const registerExportRoutes = (
  app: Hono<{ Variables: AppVariables }>,
  options?: RegisterExportRoutesOptions,
): void => {
  const authenticate = options?.authenticate ?? requireAuth;

  app.post("/", authenticate, async (c) => {
    const database = c.get("db");
    const [jsonBody, jsonErr] = await tryCatchAsync(() => c.req.json());
    if (jsonErr != null) {
      return c.json({ message: "Corpo da requisição inválido" }, 400);
    }
    const parsed = exportRequestSchema.safeParse(jsonBody);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const [bytes, zipErr] = await tryCatchAsync(() =>
      exportPatternsZip({
        database,
        patternIds: parsed.data.patternIds,
      }),
    );
    if (zipErr != null) {
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

export const createExportApp = (): Hono<{ Variables: AppVariables }> => {
  const exportApp = new Hono<{ Variables: AppVariables }>();
  registerExportRoutes(exportApp);
  return exportApp;
};
