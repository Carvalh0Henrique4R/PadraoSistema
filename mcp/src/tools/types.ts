import type { z } from "zod";

export interface McpTool {
  name: string;
  description: string;
  handler: (input: unknown) => Promise<unknown>;
  inputSchema: z.ZodObject<z.ZodRawShape>;
}
