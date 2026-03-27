import type { Hono } from "hono";
import { raise, tryCatchAsync } from "@padraosistema/lib";
import { requireAuth } from "~/middlewares/requireAuth";
import type { AppVariables } from "~/types/app";
import { firstZodMessage } from "~/modules/patterns/patterns.schema";
import { getPatternVersionForUser, listPatternVersionsForUser } from "./patternVersions.actions";
import { patternVersionDetailParamsSchema, patternVersionListParamsSchema } from "./patternVersions.schema";
import { respondIfPatternVersionRouteError } from "./patternVersions.routeErrors";

export const registerPatternVersionRoutes = (app: Hono<{ Variables: AppVariables }>): void => {
  app.get("/:id/versions/:versionNumber", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const rawParams = {
      id: c.req.param("id"),
      versionNumber: c.req.param("versionNumber"),
    };
    const parsed = patternVersionDetailParamsSchema.safeParse(rawParams);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const [data, err] = await tryCatchAsync(async () =>
      getPatternVersionForUser({
        database,
        patternId: parsed.data.id,
        userId: user.id,
        version: parsed.data.versionNumber,
      }),
    );
    if (err != null) {
      const mapped = respondIfPatternVersionRouteError({ c, err, includeMissingVersion: true });
      if (mapped != null) {
        return mapped;
      }
      throw err;
    }
    return c.json(data);
  });

  app.get("/:id/versions", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const rawParams = { id: c.req.param("id") };
    const parsed = patternVersionListParamsSchema.safeParse(rawParams);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const [data, err] = await tryCatchAsync(async () =>
      listPatternVersionsForUser({
        database,
        patternId: parsed.data.id,
        userId: user.id,
      }),
    );
    if (err != null) {
      const mapped = respondIfPatternVersionRouteError({ c, err, includeMissingVersion: false });
      if (mapped != null) {
        return mapped;
      }
      throw err;
    }
    return c.json(data);
  });
};
