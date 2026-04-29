import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
export const systemLogs = pgTable("system_logs", {
    action: text("action").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    id: uuid("id").primaryKey().defaultRandom(),
    metadata: jsonb("metadata").notNull().default({}).$type(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
});
