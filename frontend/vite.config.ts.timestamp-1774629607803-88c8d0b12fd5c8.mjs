// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Users/henrique.carvalho/Documents/PadraoSistema/padraosistema/node_modules/.bun/vite@5.4.21+978fb0d7d9b458bf/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Users/henrique.carvalho/Documents/PadraoSistema/padraosistema/node_modules/.bun/@vitejs+plugin-react@4.7.0+de9f0755fd6bea1e/node_modules/@vitejs/plugin-react/dist/index.js";
import { tanstackRouter } from "file:///D:/Users/henrique.carvalho/Documents/PadraoSistema/padraosistema/node_modules/.bun/@tanstack+router-plugin@1.166.14+4307ee47eead2653/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///D:/Users/henrique.carvalho/Documents/PadraoSistema/padraosistema/frontend/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var hasEnv = (value) => value != null && value.length > 0;
var createApiProxy = (backendUrl) => ({
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq, req) => {
      const host = req.headers.host;
      if (typeof host === "string" && host.length > 0) {
        proxyReq.setHeader("X-Forwarded-Host", host);
      }
      const rawProto = req.headers["x-forwarded-proto"];
      const proto = typeof rawProto === "string" ? rawProto.split(",")[0]?.trim() ?? "http" : "http";
      proxyReq.setHeader("X-Forwarded-Proto", proto);
    });
  },
  target: backendUrl
});
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const vitePort = hasEnv(env.VITE_PORT) ? Number(env.VITE_PORT) : 5173;
  const backendUrl = hasEnv(env.VITE_BACKEND_URL) ? env.VITE_BACKEND_URL : "http://localhost:3000";
  const apiProxy = createApiProxy(backendUrl);
  return {
    plugins: [
      tanstackRouter({
        autoCodeSplitting: true,
        target: "react"
      }),
      react()
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src")
      }
    },
    preview: {
      port: vitePort,
      proxy: {
        "/api": apiProxy,
        "/uploads": apiProxy
      }
    },
    server: {
      cors: false,
      port: vitePort,
      proxy: {
        "/api": apiProxy,
        "/uploads": apiProxy
      },
      watch: {
        ignored: ["**/routeTree.gen.ts", "**/*.tsbuildinfo"]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxoZW5yaXF1ZS5jYXJ2YWxob1xcXFxEb2N1bWVudHNcXFxcUGFkcmFvU2lzdGVtYVxcXFxwYWRyYW9zaXN0ZW1hXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxoZW5yaXF1ZS5jYXJ2YWxob1xcXFxEb2N1bWVudHNcXFxcUGFkcmFvU2lzdGVtYVxcXFxwYWRyYW9zaXN0ZW1hXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9oZW5yaXF1ZS5jYXJ2YWxoby9Eb2N1bWVudHMvUGFkcmFvU2lzdGVtYS9wYWRyYW9zaXN0ZW1hL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IHRhbnN0YWNrUm91dGVyIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcbmltcG9ydCB0eXBlIHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSBcIm5vZGU6aHR0cFwiO1xuaW1wb3J0IHR5cGUgeyBQcm94eU9wdGlvbnMgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XG5cbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuXG5jb25zdCBoYXNFbnYgPSAodmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHZhbHVlIGlzIHN0cmluZyA9PiB2YWx1ZSAhPSBudWxsICYmIHZhbHVlLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGNyZWF0ZUFwaVByb3h5ID0gKGJhY2tlbmRVcmw6IHN0cmluZyk6IFByb3h5T3B0aW9ucyA9PiAoe1xuICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gIGNvbmZpZ3VyZTogKHByb3h5KTogdm9pZCA9PiB7XG4gICAgcHJveHkub24oXCJwcm94eVJlcVwiLCAocHJveHlSZXEsIHJlcTogSW5jb21pbmdNZXNzYWdlKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBob3N0ID0gcmVxLmhlYWRlcnMuaG9zdDtcbiAgICAgIGlmICh0eXBlb2YgaG9zdCA9PT0gXCJzdHJpbmdcIiAmJiBob3N0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKFwiWC1Gb3J3YXJkZWQtSG9zdFwiLCBob3N0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhd1Byb3RvID0gcmVxLmhlYWRlcnNbXCJ4LWZvcndhcmRlZC1wcm90b1wiXTtcbiAgICAgIGNvbnN0IHByb3RvID1cbiAgICAgICAgdHlwZW9mIHJhd1Byb3RvID09PSBcInN0cmluZ1wiID8gcmF3UHJvdG8uc3BsaXQoXCIsXCIpWzBdPy50cmltKCkgPz8gXCJodHRwXCIgOiBcImh0dHBcIjtcbiAgICAgIHByb3h5UmVxLnNldEhlYWRlcihcIlgtRm9yd2FyZGVkLVByb3RvXCIsIHByb3RvKTtcbiAgICB9KTtcbiAgfSxcbiAgdGFyZ2V0OiBiYWNrZW5kVXJsLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcbiAgY29uc3Qgdml0ZVBvcnQgPSBoYXNFbnYoZW52LlZJVEVfUE9SVCkgPyBOdW1iZXIoZW52LlZJVEVfUE9SVCkgOiA1MTczO1xuICBjb25zdCBiYWNrZW5kVXJsID0gaGFzRW52KGVudi5WSVRFX0JBQ0tFTkRfVVJMKSA/IGVudi5WSVRFX0JBQ0tFTkRfVVJMIDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbiAgY29uc3QgYXBpUHJveHkgPSBjcmVhdGVBcGlQcm94eShiYWNrZW5kVXJsKTtcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHRhbnN0YWNrUm91dGVyKHtcbiAgICAgICAgYXV0b0NvZGVTcGxpdHRpbmc6IHRydWUsXG4gICAgICAgIHRhcmdldDogXCJyZWFjdFwiLFxuICAgICAgfSksXG4gICAgICByZWFjdCgpLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJ+XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgcG9ydDogdml0ZVBvcnQsXG4gICAgICBwcm94eToge1xuICAgICAgICBcIi9hcGlcIjogYXBpUHJveHksXG4gICAgICAgIFwiL3VwbG9hZHNcIjogYXBpUHJveHksXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBjb3JzOiBmYWxzZSxcbiAgICAgIHBvcnQ6IHZpdGVQb3J0LFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgXCIvYXBpXCI6IGFwaVByb3h5LFxuICAgICAgICBcIi91cGxvYWRzXCI6IGFwaVByb3h5LFxuICAgICAgfSxcbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIGlnbm9yZWQ6IFtcIioqL3JvdXRlVHJlZS5nZW4udHNcIiwgXCIqKi8qLnRzYnVpbGRpbmZvXCJdLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJaLFNBQVMsY0FBYyxlQUFlO0FBQ2pjLE9BQU8sV0FBVztBQUNsQixTQUFTLHNCQUFzQjtBQUcvQixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFOeU8sSUFBTSwyQ0FBMkM7QUFReFQsSUFBTSxZQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFFN0QsSUFBTSxTQUFTLENBQUMsVUFBK0MsU0FBUyxRQUFRLE1BQU0sU0FBUztBQUUvRixJQUFNLGlCQUFpQixDQUFDLGdCQUFzQztBQUFBLEVBQzVELGNBQWM7QUFBQSxFQUNkLFdBQVcsQ0FBQyxVQUFnQjtBQUMxQixVQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsUUFBK0I7QUFDN0QsWUFBTSxPQUFPLElBQUksUUFBUTtBQUN6QixVQUFJLE9BQU8sU0FBUyxZQUFZLEtBQUssU0FBUyxHQUFHO0FBQy9DLGlCQUFTLFVBQVUsb0JBQW9CLElBQUk7QUFBQSxNQUM3QztBQUNBLFlBQU0sV0FBVyxJQUFJLFFBQVEsbUJBQW1CO0FBQ2hELFlBQU0sUUFDSixPQUFPLGFBQWEsV0FBVyxTQUFTLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLEtBQUssU0FBUztBQUM1RSxlQUFTLFVBQVUscUJBQXFCLEtBQUs7QUFBQSxJQUMvQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUNWO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxRQUFNLFdBQVcsT0FBTyxJQUFJLFNBQVMsSUFBSSxPQUFPLElBQUksU0FBUyxJQUFJO0FBQ2pFLFFBQU0sYUFBYSxPQUFPLElBQUksZ0JBQWdCLElBQUksSUFBSSxtQkFBbUI7QUFDekUsUUFBTSxXQUFXLGVBQWUsVUFBVTtBQUUxQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxlQUFlO0FBQUEsUUFDYixtQkFBbUI7QUFBQSxRQUNuQixRQUFRO0FBQUEsTUFDVixDQUFDO0FBQUEsTUFDRCxNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFlBQVk7QUFBQSxNQUNkO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsdUJBQXVCLGtCQUFrQjtBQUFBLE1BQ3JEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
