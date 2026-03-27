import type { PatternVersionDetail, PatternVersionListItem } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { PatternForbiddenError, PatternNotFoundError } from "~/modules/patterns/patterns.errors";
import { findPatternRowById } from "~/modules/patterns/patterns.service";
import { PatternVersionNotFoundError } from "./patternVersions.errors";
import {
  selectPatternVersionByPatternIdAndVersion,
  selectPatternVersionsByPatternIdDesc,
} from "./patternVersions.repository";
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
