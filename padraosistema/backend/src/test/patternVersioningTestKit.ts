import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { SQL } from "bun";
import { eq } from "drizzle-orm";
import { raise } from "@padraosistema/lib";
import { resolve } from "path";
import type { AppDb } from "~/db/index";
import { patterns } from "~/db/schema/patterns";
import { systemLogs } from "~/db/schema/system_logs";
import { users } from "~/db/schema/users";

export const closeTestDatabase = async (client: SQL): Promise<void> => {
  await client.end();
};

export const deleteUserCascadePatterns = async (params: { database: AppDb; userId: string }): Promise<void> => {
  await params.database.delete(systemLogs).where(eq(systemLogs.userId, params.userId));
  await params.database.delete(patterns).where(eq(patterns.userId, params.userId));
  await params.database.delete(users).where(eq(users.id, params.userId));
};

export const insertTestUser = async (database: AppDb): Promise<string> => {
  const email = `${randomUUID()}@pattern-versioning.integration`;
  const [row] = await database
    .insert(users)
    .values({
      email,
      name: "Pattern versioning integration",
    })
    .returning();
  return row.id;
};

export const openTestDatabase = async (): Promise<{ client: SQL; db: AppDb }> => {
  const url = Bun.env.DATABASE_URL ?? raise("DATABASE_URL not set");
  const client = new SQL(url);
  const db = drizzle({ client });
  const migrationsFolder = resolve(import.meta.dir, "../db/migrations");
  await migrate(db, { migrationsFolder });
  return { client, db };
};
