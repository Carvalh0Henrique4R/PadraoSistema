import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { AuthConfig } from "@auth/core";
import type { AppDb } from "~/db/index";
import { registerExportHistoryRoutes } from "~/modules/export-history/export-history.controller";
import { registerExportRoutes } from "~/modules/export/export.controller";
import type { AppVariables } from "~/types/app";

export const createExportSubAppWithUser = (params: {
  userId: string;
}): Hono<{ Variables: AppVariables }> => {
  const injectUser: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
    c.set("user", { email: "export@test", id: params.userId, name: "Export" });
    await next();
  };
  const exportApp = new Hono<{ Variables: AppVariables }>();
  registerExportRoutes(exportApp, { authenticate: injectUser });
  registerExportHistoryRoutes(exportApp, { authenticate: injectUser });
  return exportApp;
};

export const createApiAppWithExport = (params: {
  authConfig: AuthConfig;
  database: AppDb;
  userId: string;
}): Hono<{ Variables: AppVariables }> => {
  const app = new Hono<{ Variables: AppVariables }>();
  app.use("*", async (c, next) => {
    c.set("authConfig", params.authConfig);
    c.set("db", params.database);
    await next();
  });
  const exportApp = createExportSubAppWithUser({ userId: params.userId });
  app.route("/api/export", exportApp);
  return app;
};
