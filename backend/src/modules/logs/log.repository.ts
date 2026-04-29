import type { SystemLogAction, SystemLogEntity, SystemLogMetadata } from "@padraosistema/lib";
import type { AppDb } from "~/db/index";
import { systemLogs } from "~/db/schema/system_logs";

export const insertSystemLogRow = async (params: {
  action: SystemLogAction;
  database: AppDb;
  entity: SystemLogEntity;
  entityId: string | null;
  metadata: SystemLogMetadata;
  userId: string | null;
}): Promise<void> => {
  await params.database.insert(systemLogs).values({
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    metadata: params.metadata,
    userId: params.userId,
  });
};
