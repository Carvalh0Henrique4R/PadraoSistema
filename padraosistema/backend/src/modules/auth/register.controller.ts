import { Hono } from "hono";
import { tryCatchAsync } from "@padraosistema/lib";
import type { AppVariables } from "~/types/app";
import { registerUserWithPassword } from "./register.actions";
import { EmailTakenError } from "./register.errors";
import { firstRegisterZodMessage, registerBodySchema } from "./register.schema";

export const registerApp = new Hono<{ Variables: AppVariables }>();

registerApp.post("/", async (c) => {
  const database = c.get("db");
  const body: unknown = await c.req.json();
  const parsed = registerBodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ message: firstRegisterZodMessage(parsed.error) }, 400);
  }
  const [created, err] = await tryCatchAsync(async () =>
    registerUserWithPassword({
      database,
      email: parsed.data.email,
      name: parsed.data.name,
      password: parsed.data.password,
    }),
  );
  if (err != null) {
    if (err instanceof EmailTakenError) {
      return c.json({ message: "Este e-mail já está em uso" }, 409);
    }
    throw err;
  }
  return c.json(created, 201);
});
