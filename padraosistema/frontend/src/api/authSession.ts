import { tryCatchAsync } from "@padraosistema/lib";
import { z } from "zod";
import { apiFetchSameOrigin } from "./client.util";

const authSessionSchema = z.object({
  user: z
    .object({
      id: z.string(),
    })
    .optional(),
});

export type AuthSessionUser = {
  id: string;
};

const sessionUserFromPayload = (data: unknown): AuthSessionUser | null => {
  const parsed = authSessionSchema.safeParse(data);
  if (!parsed.success) {
    return null;
  }
  const id = parsed.data.user?.id;
  if (id == null) {
    return null;
  }
  return { id };
};

export const fetchAuthSession = async (): Promise<AuthSessionUser | null> => {
  const [data, err] = await tryCatchAsync(() => apiFetchSameOrigin("/api/auth/session"));
  if (err != null) {
    return null;
  }
  return sessionUserFromPayload(data);
};
