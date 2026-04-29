import { z } from "zod";

export const exportRequestSchema = z.object({
  patternIds: z.array(z.uuid()).min(1, "Lista não pode ser vazia").max(500),
});

export const firstZodMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  return issue.message;
};
