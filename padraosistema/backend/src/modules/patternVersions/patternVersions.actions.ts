import type { Pattern, PatternVersionDetail, PatternVersionListItem } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { PatternForbiddenError, PatternNotFoundError } from "~/modules/patterns/patterns.errors";
import { findPatternRowById } from "~/modules/patterns/patterns.service";
import { PatternVersionNotFoundError } from "./patternVersions.errors";
import {
  selectPatternVersionByPatternIdAndVersion,
  selectPatternVersionsByPatternIdDesc,
} from "./patternVersions.repository";
import { logPatternVersionRevertActions } from "./patternVersions.revert.logs";
import { revertPatternVersionInTransaction } from "./patternVersions.revert.service";
import { mapJoinedRowToVersionDetail, mapJoinedRowToVersionListItem } from "./patternVersions.service";

export const listPatternVersionsForUser = async (params: {
  database: AppDb;
  patternId: string;
  userId: string;
}): Promise<PatternVersionListItem[]> => {
  const row = await findPatternRowById(params.database, params.patternId);
  if (row == null) {
    throw new PatternNotFoundError();
  }
  if (row.userId !== params.userId) {
    throw new PatternForbiddenError();
  }
  const joined = await selectPatternVersionsByPatternIdDesc({
    database: params.database,
    patternId: params.patternId,
  });
  return joined.map(mapJoinedRowToVersionListItem);
};

export const getPatternVersionForUser = async (params: {
  database: AppDb;
  patternId: string;
  userId: string;
  version: number;
}): Promise<PatternVersionDetail> => {
  const row = await findPatternRowById(params.database, params.patternId);
  if (row == null) {
    throw new PatternNotFoundError();
  }
  if (row.userId !== params.userId) {
    throw new PatternForbiddenError();
  }
  const joined = await selectPatternVersionByPatternIdAndVersion({
    database: params.database,
    patternId: params.patternId,
    version: params.version,
  });
  if (joined == null) {
    throw new PatternVersionNotFoundError();
  }
  return mapJoinedRowToVersionDetail(joined);
};

export const revertPatternVersionForUser = async (params: {
  database: AppDb;
  patternId: string;
  userId: string;
  versionSnapshotId: string;
}): Promise<Pattern> => {
  const result = await revertPatternVersionInTransaction({
    database: params.database,
    editorUserId: params.userId,
    patternId: params.patternId,
    versionSnapshotId: params.versionSnapshotId,
  });
  await logPatternVersionRevertActions({
    database: params.database,
    fromVersion: result.fromVersion,
    newVersion: result.newVersion,
    patternId: params.patternId,
    revertedFromVersion: result.revertedFromVersion,
    userId: params.userId,
  });
  return result.pattern;
};
