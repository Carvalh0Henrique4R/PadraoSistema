import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
export const exportHistory = pgTable("export_history", {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    id: uuid("id").primaryKey().defaultRandom(),
    patternIds: jsonb("pattern_ids").notNull().$type(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});
