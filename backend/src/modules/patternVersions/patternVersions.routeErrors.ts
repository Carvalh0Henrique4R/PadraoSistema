import type { Context } from "hono";
import { PatternForbiddenError, PatternNotFoundError } from "~/modules/patterns/patterns.errors";
import { PatternVersionNotFoundError } from "./patternVersions.errors";

export const respondIfPatternVersionRouteError = (params: {
  c: Context;
  err: unknown;
  includeMissingVersion: boolean;
}): Response | null => {
  if (params.err instanceof PatternNotFoundError) {
    return params.c.json({ message: "Padrão não encontrado" }, 404);
  }
  if (params.err instanceof PatternForbiddenError) {
    return params.c.json({ message: "Sem permissão para este padrão" }, 403);
  }
  if (params.includeMissingVersion && params.err instanceof PatternVersionNotFoundError) {
    return params.c.json({ message: "Versão não encontrada" }, 404);
  }
  return null;
};
