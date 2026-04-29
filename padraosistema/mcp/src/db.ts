import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./env";

import { exportHistory } from "../../backend/src/db/schema/export_history";
import { patternVersions } from "../../backend/src/db/schema/pattern_versions";
import { patterns } from "../../backend/src/db/schema/patterns";
import { systemLogs } from "../../backend/src/db/schema/system_logs";
import { users } from "../../backend/src/db/schema/users";

const queryClient = postgres(env.DATABASE_URL, { max: 1 });

const schema = {
  exportHistory,
  patterns,
  patternVersions,
  systemLogs,
  users,
};

export const db = drizzle(queryClient, { schema });

export { exportHistory, patternVersions, patterns, systemLogs, users };
