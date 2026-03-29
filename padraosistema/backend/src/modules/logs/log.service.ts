import type { SystemLogAction, SystemLogEntity, SystemLogMetadata } from "@padraosistema/lib";
import { tryCatchAsync } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { insertSystemLogRow } from "./log.repository";

export type LogActionParams = {
  action: SystemLogAction;
  database: AppDb;
  entity: SystemLogEntity;
  entityId: string | null;
  metadata: SystemLogMetadata;
  userId: string | null;
};

export const runSafeAsyncSideEffect = async (fn: () => Promise<void>): Promise<void> => {
  await tryCatchAsync(fn);
};

export const logAction = async (params: LogActionParams): Promise<void> => {
  await runSafeAsyncSideEffect(() =>
    insertSystemLogRow({
      action: params.action,
      database: params.database,
      entity: params.entity,
      entityId: params.entityId,
      metadata: params.metadata,
      userId: params.userId,
    }),
  );
};
