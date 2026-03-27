import { and, desc, eq } from "drizzle-orm";
import type { AppDb, AppTransaction } from "~/db/index";
import { patternVersions } from "~/db/schema/pattern_versions";
import { users } from "~/db/schema/users";

type DbExecutor = AppDb | AppTransaction;

export const insertPatternVersionSnapshot = async (params: {
  category: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  database: DbExecutor;
  patternId: string;
  status: string;
  title: string;
  version: number;
}): Promise<void> => {
  await params.database.insert(patternVersions).values({
    category: params.category,
    content: params.content,
    createdAt: params.createdAt,
    createdBy: params.createdBy,
    patternId: params.patternId,
    status: params.status,
    title: params.title,
    version: params.version,
  });
};

export type PatternVersionJoinedRow = {
  authorName: string;
  category: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  status: string;
  title: string;
  version: number;
};

export const selectPatternVersionsByPatternIdDesc = async (params: {
  database: DbExecutor;
  patternId: string;
}): Promise<PatternVersionJoinedRow[]> => {
  return params.database
    .select({
      authorName: users.name,
      category: patternVersions.category,
      content: patternVersions.content,
      createdAt: patternVersions.createdAt,
      createdBy: patternVersions.createdBy,
      status: patternVersions.status,
      title: patternVersions.title,
      version: patternVersions.version,
    })
    .from(patternVersions)
    .innerJoin(users, eq(patternVersions.createdBy, users.id))
    .where(eq(patternVersions.patternId, params.patternId))
    .orderBy(desc(patternVersions.version));
};

export const selectPatternVersionByPatternIdAndVersion = async (params: {
  database: DbExecutor;
  patternId: string;
  version: number;
}): Promise<PatternVersionJoinedRow | undefined> => {
  const [row] = await params.database
    .select({
      authorName: users.name,
      category: patternVersions.category,
      content: patternVersions.content,
      createdAt: patternVersions.createdAt,
      createdBy: patternVersions.createdBy,
      status: patternVersions.status,
      title: patternVersions.title,
      version: patternVersions.version,
    })
    .from(patternVersions)
    .innerJoin(users, eq(patternVersions.createdBy, users.id))
    .where(
      and(eq(patternVersions.patternId, params.patternId), eq(patternVersions.version, params.version)),
    );
  return row;
};
