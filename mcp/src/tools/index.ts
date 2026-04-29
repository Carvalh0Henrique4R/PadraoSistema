import { exportHistoryTools } from "./export-history";
import { patternsTools } from "./patterns";
import { systemLogsTools } from "./system-logs";

export type { McpTool } from "./types";
export { exportHistoryTools, patternsTools, systemLogsTools };

export const allMcpTools = [...exportHistoryTools, ...patternsTools, ...systemLogsTools] as const;
