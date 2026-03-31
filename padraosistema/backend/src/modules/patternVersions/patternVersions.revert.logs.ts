import type { AppDb } from "~/db/index";
import { logAction } from "~/modules/logs/log.service";

export const logPatternVersionRevertActions = async (params: {
  database: AppDb;
  fromVersion: number;
  newVersion: number;
  patternId: string;
  revertedFromVersion: number;
  userId: string;
}): Promise<void> => {
  await logAction({
    action: "CREATE_VERSION",
    database: params.database,
    entity: "pattern",
    entityId: params.patternId,
    metadata: {
      fromVersion: params.fromVersion,
      toVersion: params.newVersion,
    },
    userId: params.userId,
  });
  await logAction({
    action: "UPDATE_PATTERN",
    database: params.database,
    entity: "pattern",
    entityId: params.patternId,
    metadata: { version: params.newVersion },
    userId: params.userId,
  });
  await logAction({
    action: "REVERT_PATTERN_VERSION",
    database: params.database,
    entity: "pattern",
    entityId: params.patternId,
    metadata: {
      newVersion: params.newVersion,
      patternId: params.patternId,
      versionRevertedFrom: params.revertedFromVersion,
    },
    userId: params.userId,
  });
};
