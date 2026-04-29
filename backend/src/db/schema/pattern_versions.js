import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { patterns } from "./patterns";
import { users } from "./users";
export const patternVersions = pgTable("pattern_versions", {
    id: uuid("id").primaryKey().defaultRandom(),
    patternId: uuid("pattern_id")
        .notNull()
        .references(() => patterns.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    category: text("category").notNull(),
    content: text("content").notNull(),
    status: text("status").notNull(),
    version: integer("version").notNull(),
    createdAt: timestamp("created_at").notNull(),
    createdBy: uuid("created_by")
        .notNull()
        .references(() => users.id, { onDelete: "restrict" }),
}, (table) => [uniqueIndex("pattern_versions_pattern_id_version_uidx").on(table.patternId, table.version)]);
