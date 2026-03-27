import type { Pattern, PatternInput, PatternStatus } from "@padraosistema/lib";
import { eq } from "drizzle-orm";
import { patterns } from "~/db/schema/patterns";
import type { AppDb, AppTransaction } from "~/db/index";
import { patternStatusSchema } from "./patterns.schema";

export type PatternRow = typeof patterns.$inferSelect;

type DbExecutor = AppDb | AppTransaction;

const mapStatus = (value: string): PatternStatus => {
  const parsedStatus = patternStatusSchema.safeParse(value);
  return parsedStatus.success ? parsedStatus.data : "draft";
};

export const mapRowToApiPattern = (record: PatternRow): Pattern => ({
  category: record.category,
  content: record.content,
  createdAt: record.createdAt.toISOString(),
  id: record.id,
  status: mapStatus(record.status),
  title: record.title,
  userId: record.userId,
  version: record.version,
});

export const listPatternRows = async (database: AppDb, category: string | undefined): Promise<PatternRow[]> => {
  if (category != null && category.length > 0) {
    return database.select().from(patterns).where(eq(patterns.category, category));
  }
  return database.select().from(patterns);
};

export const findPatternRowById = async (database: AppDb, id: string): Promise<PatternRow | undefined> => {
  const [row] = await database.select().from(patterns).where(eq(patterns.id, id));
  return row;
};

export const findPatternRowByIdForUpdate = async (params: {
  database: DbExecutor;
  id: string;
}): Promise<PatternRow | undefined> => {
  const [row] = await params.database
    .select()
    .from(patterns)
    .where(eq(patterns.id, params.id))
    .for("update");
  return row;
};

export const patternContentUnchanged = (params: {
  existing: PatternRow;
  input: PatternInput;
}): boolean => {
  const nextStatus = params.input.status ?? mapStatus(params.existing.status);
  return (
    params.existing.title === params.input.title &&
    params.existing.category === params.input.category &&
    params.existing.content === params.input.content &&
    mapStatus(params.existing.status) === nextStatus
  );
};

export const insertPatternRow = async (params: {
  database: AppDb;
  input: PatternInput;
  userId: string;
}): Promise<PatternRow> => {
  const [inserted] = await params.database
    .insert(patterns)
    .values({
      category: params.input.category,
      content: params.input.content,
      status: params.input.status ?? "draft",
      title: params.input.title,
      userId: params.userId,
    })
    .returning();
  return inserted;
};

export const updatePatternRowWithVersionBump = async (params: {
  database: DbExecutor;
  existing: PatternRow;
  id: string;
  input: PatternInput;
  nextVersion: number;
  updatedAt: Date;
}): Promise<PatternRow | undefined> => {
  const nextStatus = params.input.status ?? mapStatus(params.existing.status);
  const [updated] = await params.database
    .update(patterns)
    .set({
      category: params.input.category,
      content: params.input.content,
      status: nextStatus,
      title: params.input.title,
      updatedAt: params.updatedAt,
      version: params.nextVersion,
    })
    .where(eq(patterns.id, params.id))
    .returning();
  return updated;
};

export const deletePatternRow = async (database: AppDb, id: string): Promise<PatternRow | undefined> => {
  const [deleted] = await database.delete(patterns).where(eq(patterns.id, id)).returning();
  return deleted;
};
