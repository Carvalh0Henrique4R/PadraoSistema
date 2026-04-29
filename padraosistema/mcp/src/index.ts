import "./env";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { tryCatchAsync } from "@padraosistema/lib";

import { allMcpTools } from "./tools/index.js";

const registerTools = (server: McpServer): void => {
  allMcpTools.forEach((tool) => {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      async (args, _extra): Promise<CallToolResult> => {
        const [payload, invocationError] = await tryCatchAsync(async () => tool.handler(args));

        if (invocationError !== null) {
          return {
            content: [{ text: `Erro: ${invocationError.message}`, type: "text" }],
            isError: true,
          };
        }

        return {
          content: [{ text: JSON.stringify(payload ?? null, null, 2), type: "text" }],
        };
      },
    );
  });
};

const bootstrap = async (): Promise<void> => {
  const server = new McpServer({
    name: "padraosistema-mcp",
    version: "0.0.0",
  });
  const transport = new StdioServerTransport();

  registerTools(server);
  await server.connect(transport);
  console.error("✅ padraosistema-mcp iniciado");
};

await bootstrap();
