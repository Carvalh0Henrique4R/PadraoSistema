import type { PatternInput } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { logAction } from "~/modules/logs/log.service";
import { applyPatternUpdateWithVersioning } from "~/modules/patternVersions/patternVersions.applyUpdate.service";
import { PatternForbiddenError, PatternNotFoundError } from "./patterns.errors";
import {
  deletePatternRow,
  findPatternRowById,
  insertPatternRow,
  listPatternRows,
  mapRowToApiPattern,
} from "./patterns.service";

export const listPatternsForApi = async (
  database: AppDb,
  category: string | undefined,
): Promise<ReturnType<typeof mapRowToApiPattern>[]> => {
  const rows = await listPatternRows(database, category);
  return rows.map(mapRowToApiPattern);
};

export const getPatternForApi = async (database: AppDb, id: string): Promise<ReturnType<typeof mapRowToApiPattern>> => {
  const row = await findPatternRowById(database, id);
  if (row == null) {
    throw new PatternNotFoundError();
  }
  return mapRowToApiPattern(row);
};

export const createPatternForUser = async (params: {
  database: AppDb;
  input: PatternInput;
  userId: string;
}): Promise<ReturnType<typeof mapRowToApiPattern>> => {
  const row = await insertPatternRow({
    database: params.database,
    input: params.input,
    userId: params.userId,
  });
  const pattern = mapRowToApiPattern(row);
  await logAction({
    action: "CREATE_PATTERN",
    database: params.database,
    entity: "pattern",
    entityId: pattern.id,
    metadata: { category: pattern.category, title: pattern.title },
    userId: params.userId,
  });
  return pattern;
};

export const updatePatternForUser = async (params: {
  database: AppDb;
  id: string;
  input: PatternInput;
  userId: string;
}): Promise<ReturnType<typeof mapRowToApiPattern>> => {
  const result = await applyPatternUpdateWithVersioning({
    database: params.database,
    editorUserId: params.userId,
    input: params.input,
    patternId: params.id,
  });
  if (result.createdVersionSnapshot) {
    await logAction({
      action: "CREATE_VERSION",
      database: params.database,
      entity: "pattern",
      entityId: params.id,
      metadata: {
        fromVersion: result.fromVersion ?? null,
        toVersion: result.toVersion ?? null,
      },
      userId: params.userId,
    });
    await logAction({
      action: "UPDATE_PATTERN",
      database: params.database,
      entity: "pattern",
      entityId: params.id,
      metadata: { version: result.pattern.version },
      userId: params.userId,
    });
  } else {
    await logAction({
      action: "UPDATE_PATTERN",
      database: params.database,
      entity: "pattern",
      entityId: params.id,
      metadata: { unchanged: true },
      userId: params.userId,
    });
  }
  return result.pattern;
};

export const deletePatternForUser = async (params: { database: AppDb; id: string; userId: string }): Promise<void> => {
  const existing = await findPatternRowById(params.database, params.id);
  if (existing == null) {
    throw new PatternNotFoundError();
  }
  if (existing.userId !== params.userId) {
    throw new PatternForbiddenError();
  }
  const deleted = await deletePatternRow(params.database, params.id);
  if (deleted == null) {
    throw new PatternNotFoundError();
  }
  await logAction({
    action: "DELETE_PATTERN",
    database: params.database,
    entity: "pattern",
    entityId: params.id,
    metadata: { title: existing.title },
    userId: params.userId,
  });
};
