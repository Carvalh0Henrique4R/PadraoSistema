import { z } from "zod";

export const patternStatusSchema = z.enum(["stable", "review", "draft", "deprecated"]);

export const patternInputSchema = z.object({
  title: z.string().min(1, "Dado [title] é obrigatório"),
  category: z.string().min(1, "Dado [category] é obrigatório"),
  content: z.string().min(1, "Dado [content] é obrigatório"),
  status: patternStatusSchema.optional(),
});

export const firstZodMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  return issue.message;
};
