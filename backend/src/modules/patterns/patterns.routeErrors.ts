import type { Context } from "hono";
import { PatternForbiddenError, PatternInvalidVersionError, PatternNotFoundError } from "./patterns.errors";

export const respondIfPutPatternError = (params: { c: Context; err: unknown }): Response | null => {
  if (params.err instanceof PatternNotFoundError) {
    return params.c.json({ message: "Padrão não encontrado" }, 404);
  }
  if (params.err instanceof PatternForbiddenError) {
    return params.c.json({ message: "Sem permissão para este padrão" }, 403);
  }
  if (params.err instanceof PatternInvalidVersionError) {
    return params.c.json({ message: "Versão do padrão inconsistente" }, 409);
  }
  return null;
};
