import type { AppTransaction } from "~/db/index";
import {
  PatternForbiddenError,
  PatternInvalidVersionError,
  PatternNotFoundError,
} from "~/modules/patterns/patterns.errors";
import { findPatternRowByIdForUpdate, type PatternRow } from "~/modules/patterns/patterns.service";

export const loadLockedPatternForVersioning = async (params: {
  database: AppTransaction;
  editorUserId: string;
  patternId: string;
}): Promise<PatternRow> => {
  const locked = await findPatternRowByIdForUpdate({ database: params.database, id: params.patternId });
  if (locked == null) {
    throw new PatternNotFoundError();
  }
  if (locked.userId !== params.editorUserId) {
    throw new PatternForbiddenError();
  }
  if (locked.version < 1) {
    throw new PatternInvalidVersionError();
  }
  return locked;
};
