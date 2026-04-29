import { z } from "zod";

export const exportRetryRequestSchema = z.object({
  historyId: z.uuid(),
});

export const firstZodMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  return issue.message;
};
