/**
 * Shared Drizzle migrate helpers for CLI scripts (run-migrations, reset-db).
 */
import { dirname, join } from "node:path";
import { inspect } from "node:util";
import { fileURLToPath } from "node:url";
import { tryCatchAsync } from "@padraosistema/lib";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const migrationsFolder = join(__dirname, "../src/db/migrations");

export const DUPLICATE_TABLE_PG_CODE = "42P07";

const PG_CODE_PATTERN = /^[0-9A-Z]{5}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isPgCode = (code: unknown): code is string =>
  typeof code === "string" && PG_CODE_PATTERN.test(code);

type NestedScan = { readonly childDepth: number; readonly index: number; readonly values: unknown[] };

const firstPgCodeInValues = (scan: NestedScan): string | undefined => {
  if (scan.index >= scan.values.length) {
    return;
  }
  const code = findPostgresErrorCode(scan.values[scan.index], scan.childDepth);
  if (code != null) {
    return code;
  }
  return firstPgCodeInValues({ ...scan, index: scan.index + 1 });
};

const scanNestedForPgCode = (record: Record<string, unknown>, depth: number): string | undefined =>
  firstPgCodeInValues({ values: Object.values(record), index: 0, childDepth: depth + 1 });

export const findPostgresErrorCode = (value: unknown, depth = 0): string | undefined => {
  if (depth > 5) {
    return;
  }
  if (!isRecord(value)) {
    return;
  }
  if (isPgCode(value.code)) {
    return value.code;
  }
  if (value instanceof Error && value.cause != null) {
    return findPostgresErrorCode(value.cause, depth + 1);
  }
  return scanNestedForPgCode(value, depth);
};

export const hintForPostgresCode = (pgCode: string | undefined): string => {
  if (pgCode === DUPLICATE_TABLE_PG_CODE) {
    return [
      "",
      "PostgreSQL 42P07 = relação (tabela) já existe. O Drizzle está aplicando a migração inicial",
      "mas o banco já tem essas tabelas — por exemplo após `db:push`, restore sem histórico, ou",
      "`drizzle.__drizzle_migrations` vazio/inconsistente.",
      "",
      "Em desenvolvimento: `bun run db:reset` (apaga dados) ou recrie o schema manualmente e rode",
      "`bun run db:migrate`.",
      "",
    ].join("\n");
  }
  return "";
};

export const writeMigrationFailure = (migrateError: unknown): void => {
  const pgCode = findPostgresErrorCode(migrateError);
  process.stderr.write(`Migration failed:\n${inspect(migrateError, { depth: null })}\n`);
  const hint = hintForPostgresCode(pgCode);
  if (hint.length > 0) {
    process.stderr.write(hint);
  }
};

export const runMigrateFlow = async (databaseUrl: string): Promise<Error | null> => {
  const sql = postgres(databaseUrl, { max: 1 });
  const db = drizzle(sql);
  const [, migrateError] = await tryCatchAsync(async (): Promise<void> => {
    await migrate(db, { migrationsFolder });
  });
  await sql.end({ timeout: 5 });
  return migrateError;
};
