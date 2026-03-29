import type { MiddlewareHandler } from "hono";
import type { AppVariables } from "~/types/app";

export type ExportRouteAuthOptions = {
  authenticate: MiddlewareHandler<{ Variables: AppVariables }> | undefined;
};
