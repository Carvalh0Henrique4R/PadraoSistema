import { z } from "zod";
import { apiFetch } from "./client.util";

const registeredUserSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
});

export type RegisteredUser = z.infer<typeof registeredUserSchema>;

export const registerWithPassword = async (params: {
  email: string;
  name: string;
  password: string;
}): Promise<RegisteredUser> => {
  const data = await apiFetch("/api/register", {
    body: JSON.stringify(params),
    method: "POST",
  });
  const parsed = registeredUserSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Resposta de registro inválida");
  }
  return parsed.data;
};
