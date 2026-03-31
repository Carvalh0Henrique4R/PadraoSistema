import { z } from "zod";

export const patternStatusApiSchema = z.enum(["stable", "review", "draft", "deprecated"]);

export const patternApiSchema = z.object({
  category: z.string(),
  content: z.string(),
  createdAt: z.string(),
  id: z.uuid(),
  status: patternStatusApiSchema,
  title: z.string(),
  userId: z.uuid(),
  version: z.number().int().positive(),
});

export const patternListApiSchema = z.array(patternApiSchema);

export const patternImportResponseSchema = z.object({
  created: z.number().int().nonnegative(),
  success: z.literal(true),
});

export const uploadResponseSchema = z.object({
  url: z.string(),
});

export const patternVersionListItemSchema = z.object({
  authorName: z.string(),
  createdAt: z.string(),
  createdBy: z.uuid(),
  id: z.uuid(),
  title: z.string(),
  version: z.number().int().positive(),
});

export const patternVersionListApiSchema = z.array(patternVersionListItemSchema);

export const patternVersionDetailApiSchema = z.object({
  authorName: z.string(),
  category: z.string(),
  content: z.string(),
  createdAt: z.string(),
  createdBy: z.uuid(),
  id: z.uuid(),
  status: patternStatusApiSchema,
  title: z.string(),
  version: z.number().int().positive(),
});
