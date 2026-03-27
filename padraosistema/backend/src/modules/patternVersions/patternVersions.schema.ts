import { z } from "zod";

export const patternVersionListParamsSchema = z.object({
  id: z.uuid(),
});

export const patternVersionDetailParamsSchema = z.object({
  id: z.uuid(),
  versionNumber: z.coerce.number().int().positive(),
});
