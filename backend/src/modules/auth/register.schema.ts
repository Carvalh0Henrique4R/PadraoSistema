import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.email(),
  name: z.string().min(1, "Dado [name] é obrigatório"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const firstRegisterZodMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  return issue.message;
};
