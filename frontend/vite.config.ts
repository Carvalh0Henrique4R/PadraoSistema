import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { IncomingMessage } from "node:http";
import type { ProxyOptions } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasEnv = (value: string | undefined): value is string => value != null && value.length > 0;

const createApiProxy = (backendUrl: string): ProxyOptions => ({
  changeOrigin: true,
  configure: (proxy): void => {
    proxy.on("proxyReq", (proxyReq, req: IncomingMessage): void => {
      const host = req.headers.host;
      if (typeof host === "string" && host.length > 0) {
        proxyReq.setHeader("X-Forwarded-Host", host);
      }
      const rawProto = req.headers["x-forwarded-proto"];
      const proto =
        typeof rawProto === "string" ? rawProto.split(",")[0]?.trim() ?? "http" : "http";
      proxyReq.setHeader("X-Forwarded-Proto", proto);
    });
  },
  target: backendUrl,
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const vitePort = hasEnv(env.VITE_PORT) ? Number(env.VITE_PORT) : 5173;
  const backendUrl = hasEnv(env.VITE_BACKEND_URL) ? env.VITE_BACKEND_URL : "http://localhost:3000";
  const apiProxy = createApiProxy(backendUrl);

  return {
    plugins: [
      tanstackRouter({
        autoCodeSplitting: true,
        target: "react",
      }),
      react(),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      port: vitePort,
      proxy: {
        "/api": apiProxy,
        "/uploads": apiProxy,
      },
    },
    server: {
      cors: false,
      port: vitePort,
      proxy: {
        "/api": apiProxy,
        "/uploads": apiProxy,
      },
      watch: {
        ignored: ["**/routeTree.gen.ts", "**/*.tsbuildinfo"],
      },
    },
  };
});
