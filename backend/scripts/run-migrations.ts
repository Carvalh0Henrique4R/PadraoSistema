/**
 * Runs Drizzle migrations with the same logic as drizzle-kit migrate, but prints
 * the full error object (drizzle-kit often exits 1 without a clear message on Windows).
 */
import { raise } from "@padraosistema/lib";
import { z } from "zod";
import { runMigrateFlow, writeMigrationFailure } from "./migrate-flow";

const databaseUrlParsed = z.url().safeParse(Bun.env.DATABASE_URL);
if (!databaseUrlParsed.success) {
  raise("DATABASE_URL must be set and valid");
}

const migrateError = await runMigrateFlow(databaseUrlParsed.data);

if (migrateError == null) {
  process.stdout.write("Migrations applied successfully.\n");
} else {
  writeMigrationFailure(migrateError);
  process.exit(1);
}
