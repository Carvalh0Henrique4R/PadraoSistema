/**
 * Drops public + drizzle schemas and reapplies migrations. Destructive.
 * Allowed only when ENVIRONMENT is development/testing, or ALLOW_DB_RESET=1.
 */
import { inspect } from "node:util";
import { raise, tryCatchAsync } from "@padraosistema/lib";
import postgres from "postgres";
import { z } from "zod";
import { runMigrateFlow, writeMigrationFailure } from "./migrate-flow";

const environment = Bun.env.ENVIRONMENT ?? "development";
if (environment === "production") {
  raise("Refusing to reset database when ENVIRONMENT=production");
}
if (environment !== "development" && environment !== "testing" && Bun.env.ALLOW_DB_RESET !== "1") {
  raise(
    "Refusing to reset: use ENVIRONMENT=development or testing, or set ALLOW_DB_RESET=1 intentionally.",
  );
}

const databaseUrlParsed = z.url().safeParse(Bun.env.DATABASE_URL);
if (!databaseUrlParsed.success) {
  raise("DATABASE_URL must be set and valid");
}
const databaseUrl = databaseUrlParsed.data;

const sql = postgres(databaseUrl, { max: 1 });
const [, dropError] = await tryCatchAsync(async (): Promise<void> => {
  await sql.unsafe(
    "DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;",
  );
});
await sql.end({ timeout: 5 });

if (dropError != null) {
  process.stderr.write(`Schema reset failed:\n${inspect(dropError, { depth: null })}\n`);
  process.exit(1);
}

process.stdout.write("Schemas dropped; running migrations…\n");

const migrateError = await runMigrateFlow(databaseUrl);

if (migrateError == null) {
  process.stdout.write("Database reset and migrations applied successfully.\n");
} else {
  writeMigrationFailure(migrateError);
  process.exit(1);
}
