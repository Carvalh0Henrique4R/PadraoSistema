import { Hono } from "hono";
import { registerPatternRoutes } from "~/modules/patterns/patterns.controller";
import { registerApp } from "~/modules/auth/register.controller";
import { uploadApp } from "~/upload";
import type { AppVariables } from "~/types/app";

export const mountApiRoutes = (app: Hono<{ Variables: AppVariables }>): void => {
  app.route("/api/register", registerApp);

  const patternsApp = new Hono<{ Variables: AppVariables }>();
  registerPatternRoutes(patternsApp);
  app.route("/api/patterns", patternsApp);

  app.route("/api/patterns/upload", uploadApp);
};
