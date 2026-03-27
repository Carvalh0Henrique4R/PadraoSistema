import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "../env/env";
import { SQL } from "bun";

const client = new SQL(env.DATABASE_URL);
export const db = drizzle({ client });
export type AppDb = typeof db;
export type AppTransaction = Parameters<Parameters<AppDb["transaction"]>[0]>[0];
