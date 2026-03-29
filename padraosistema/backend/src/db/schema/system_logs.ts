import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { SystemLogMetadata } from "@padraosistema/lib";
import { users } from "./users";

export const systemLogs = pgTable("system_logs", {
  action: text("action").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  id: uuid("id").primaryKey().defaultRandom(),
  metadata: jsonb("metadata").notNull().default({}).$type<SystemLogMetadata>(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
});

export type SystemLogRow = typeof systemLogs.$inferSelect;
export type NewSystemLogRow = typeof systemLogs.$inferInsert;
