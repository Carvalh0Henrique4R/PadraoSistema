import type { Pattern, PatternInput, PatternStatus } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { PatternNotFoundError } from "~/modules/patterns/patterns.errors";
import { patternStatusSchema } from "~/modules/patterns/patterns.schema";
import { mapRowToApiPattern, updatePatternRowWithVersionBump } from "~/modules/patterns/patterns.service";
import { loadLockedPatternForVersioning } from "./patternVersions.applyUpdate.helpers";
import { PatternVersionNotFoundError } from "./patternVersions.errors";
import { insertPatternVersionSnapshot, selectPatternVersionSnapshotByIdForPattern } from "./patternVersions.repository";

const mapSnapshotStatus = (value: string): PatternStatus => {
  const parsed = patternStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "draft";
};

export type RevertPatternVersionTransactionResult = {
  fromVersion: number;
  newVersion: number;
  pattern: Pattern;
  revertedFromVersion: number;
};

export const revertPatternVersionInTransaction = (params: {
  database: AppDb;
  editorUserId: string;
  patternId: string;
  versionSnapshotId: string;
}): Promise<RevertPatternVersionTransactionResult> => {
  return params.database.transaction(async (tx) => {
    const locked = await loadLockedPatternForVersioning({
      database: tx,
      editorUserId: params.editorUserId,
      patternId: params.patternId,
    });
    const source = await selectPatternVersionSnapshotByIdForPattern({
      database: tx,
      patternId: params.patternId,
      versionSnapshotId: params.versionSnapshotId,
    });
    if (source == null) {
      throw new PatternVersionNotFoundError();
    }
    const archivedAt = new Date();
    await insertPatternVersionSnapshot({
      category: locked.category,
      content: locked.content,
      createdAt: archivedAt,
      createdBy: params.editorUserId,
      database: tx,
      patternId: params.patternId,
      status: locked.status,
      title: locked.title,
      version: locked.version,
    });
    const input: PatternInput = {
      category: source.category,
      content: source.content,
      status: mapSnapshotStatus(source.status),
      title: source.title,
    };
    const nextVersion = locked.version + 1;
    const updated = await updatePatternRowWithVersionBump({
      database: tx,
      existing: locked,
      id: params.patternId,
      input,
      nextVersion,
      updatedAt: archivedAt,
    });
    if (updated == null) {
      throw new PatternNotFoundError();
    }
    return {
      fromVersion: locked.version,
      newVersion: nextVersion,
      pattern: mapRowToApiPattern(updated),
      revertedFromVersion: source.version,
    };
  });
};
