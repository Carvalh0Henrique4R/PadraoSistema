import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  MCP_LOG_LEVEL: z.enum(["debug", "info", "error"]).default("info"),
});

export type McpEnv = z.infer<typeof envSchema>;

const validatedEnv = (): McpEnv => {
  const result = envSchema.safeParse(Bun.env);

  if (!result.success) {
    process.stderr.write("Invalid environment variables for @padraosistema/mcp\n");
    result.error.issues.forEach((issue) => {
      process.stderr.write(`  ${issue.path.join(".")}: ${issue.message}\n`);
    });
    process.exit(1);
  }

  return result.data;
};

export const env = validatedEnv();
