import type { Pattern, PatternInput } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { PatternNotFoundError } from "~/modules/patterns/patterns.errors";
import { mapRowToApiPattern, patternContentUnchanged, updatePatternRowWithVersionBump } from "~/modules/patterns/patterns.service";
import { loadLockedPatternForVersioning } from "./patternVersions.applyUpdate.helpers";
import { insertPatternVersionSnapshot } from "./patternVersions.repository";

export type ApplyPatternUpdateWithVersioningResult = {
  createdVersionSnapshot: boolean;
  fromVersion?: number;
  pattern: Pattern;
  toVersion?: number;
};

export const applyPatternUpdateWithVersioning = async (params: {
  database: AppDb;
  editorUserId: string;
  input: PatternInput;
  patternId: string;
}): Promise<ApplyPatternUpdateWithVersioningResult> => {
  return params.database.transaction(async (tx) => {
    const locked = await loadLockedPatternForVersioning({
      database: tx,
      editorUserId: params.editorUserId,
      patternId: params.patternId,
    });
    if (patternContentUnchanged({ existing: locked, input: params.input })) {
      return { createdVersionSnapshot: false, pattern: mapRowToApiPattern(locked) };
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
    const nextVersion = locked.version + 1;
    const updated = await updatePatternRowWithVersionBump({
      database: tx,
      existing: locked,
      id: params.patternId,
      input: params.input,
      nextVersion,
      updatedAt: archivedAt,
    });
    if (updated == null) {
      throw new PatternNotFoundError();
    }
    return {
      createdVersionSnapshot: true,
      fromVersion: locked.version,
      pattern: mapRowToApiPattern(updated),
      toVersion: nextVersion,
    };
  });
};
