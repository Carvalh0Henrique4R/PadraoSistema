import type { Context } from "hono";
import { raise, tryCatchAsync } from "@padraosistema/lib";
import type { AppVariables } from "~/types/app";
import { firstZodMessage } from "~/modules/patterns/patterns.schema";
import { revertPatternVersionForUser } from "./patternVersions.actions";
import { patternVersionRevertBodySchema, patternVersionRevertParamsSchema } from "./patternVersions.schema";
import { respondIfPatternVersionRouteError } from "./patternVersions.routeErrors";

type HonoCtx = Context<{ Variables: AppVariables }>;

const parseRevertParams = (c: HonoCtx): { id: string } | { response: Response } => {
  const parsed = patternVersionRevertParamsSchema.safeParse({ id: c.req.param("id") });
  if (!parsed.success) {
    return { response: c.json({ message: firstZodMessage(parsed.error) }, 400) };
  }
  return parsed.data;
};

const parseRevertBody = async (c: HonoCtx): Promise<{ versionId: string } | { response: Response }> => {
  const [jsonBody, jsonErr] = await tryCatchAsync(() => c.req.json());
  if (jsonErr != null) {
    return { response: c.json({ message: "Corpo da requisição inválido" }, 400) };
  }
  const parsed = patternVersionRevertBodySchema.safeParse(jsonBody);
  if (!parsed.success) {
    return { response: c.json({ message: firstZodMessage(parsed.error) }, 400) };
  }
  return parsed.data;
};

export const handlePostRevertPatternVersion = async (c: HonoCtx): Promise<Response> => {
  const paramsResult = parseRevertParams(c);
  if ("response" in paramsResult) {
    return paramsResult.response;
  }
  const bodyResult = await parseRevertBody(c);
  if ("response" in bodyResult) {
    return bodyResult.response;
  }
  const database = c.get("db");
  const user = c.get("user") ?? raise("Missing authenticated user");
  const [data, err] = await tryCatchAsync(async () =>
    revertPatternVersionForUser({
      database,
      patternId: paramsResult.id,
      userId: user.id,
      versionSnapshotId: bodyResult.versionId,
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
};
