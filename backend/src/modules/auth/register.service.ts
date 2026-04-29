import { eq } from "drizzle-orm";
import { users } from "~/db/schema/users";
import type { AppDb } from "~/db/index";

export const selectUserByEmail = async (params: {
  database: AppDb;
  email: string;
}): Promise<typeof users.$inferSelect | undefined> => {
  const [row] = await params.database.select().from(users).where(eq(users.email, params.email));
  return row;
};

export const insertUserWithPassword = async (params: {
  database: AppDb;
  email: string;
  name: string;
  passwordHash: string;
}): Promise<typeof users.$inferSelect> => {
  const [row] = await params.database
    .insert(users)
    .values({
      email: params.email,
      name: params.name,
      passwordHash: params.passwordHash,
    })
    .returning();
  return row;
};
