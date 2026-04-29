import { z } from "zod";

export const patternVersionListParamsSchema = z.object({
  id: z.uuid(),
});

export const patternVersionDetailParamsSchema = z.object({
  id: z.uuid(),
  versionNumber: z.coerce.number().int().positive(),
});

export const patternVersionRevertParamsSchema = z.object({
  id: z.uuid(),
});

export const patternVersionRevertBodySchema = z.object({
  versionId: z.uuid(),
});
