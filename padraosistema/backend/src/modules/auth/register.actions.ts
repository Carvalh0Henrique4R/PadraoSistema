import bcrypt from "bcryptjs";
import type { AppDb } from "~/db/index";
import { EmailTakenError } from "./register.errors";
import { insertUserWithPassword, selectUserByEmail } from "./register.service";

export const registerUserWithPassword = async (params: {
  database: AppDb;
  email: string;
  name: string;
  password: string;
}): Promise<{ email: string; id: string; name: string }> => {
  const email = params.email.toLowerCase();
  const existing = await selectUserByEmail({ database: params.database, email });
  if (existing != null) {
    throw new EmailTakenError();
  }
  const passwordHash = await bcrypt.hash(params.password, 12);
  const row = await insertUserWithPassword({
    database: params.database,
    email,
    name: params.name,
    passwordHash,
  });
  return { email: row.email, id: row.id, name: row.name };
};
