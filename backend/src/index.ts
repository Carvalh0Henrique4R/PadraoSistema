import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { db } from "./db/index";
import { env } from "./env/env";
import { Hono } from "hono";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { rateLimit } from "./security/rateLimit";
import { secureHeaders } from "hono/secure-headers";
import { serveStatic } from "hono/bun";
import { tryCatch, tryCatchAsync } from "@padraosistema/lib";
import { createAuthConfig } from "./auth/createAuthConfig";
import { mountApiRoutes } from "./api/mountRoutes";
import type { AppVariables } from "./types/app";

const app = new Hono<{ Variables: AppVariables }>();

const resolveOrigin = (origin: string): string | null => {
  if (env.ENVIRONMENT !== "development") {
    return origin === new URL(env.FRONTEND_URL).origin ? origin : null;
  }
  const [parsed, err] = tryCatch(() => new URL(origin));
  if (err != null) {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }
  return origin;
};

const forwardedProtoOrHttp = (raw: string | undefined): string => {
  return typeof raw === "string" ? raw.split(",")[0]?.trim() ?? "http" : "http";
};

const hostFromPossibleUrlString = (value: string | undefined): string | undefined => {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  const [parsed, err] = tryCatch(() => new URL(value));
  if (err != null) {
    return undefined;
  }
  return parsed.host;
};

/**
 * Auth.js validates cookies/JWT against `AUTH_URL`. Behind Vite we need the browser origin (e.g. :5173), not the
 * backend :3000 Host. Prefer `x-forwarded-host`; same-origin GET /session often omits `Origin`, so also use `Referer`.
 */
const browserHostForDevAuthUrl = (c: { req: { header: (n: string) => string | undefined } }): string | undefined => {
  const xf = c.req.header("x-forwarded-host");
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0]?.trim();
  }
  const fromOrigin = hostFromPossibleUrlString(c.req.header("origin"));
  if (fromOrigin != null) {
    return fromOrigin;
  }
  return hostFromPossibleUrlString(c.req.header("referer"));
};

const syncDevAuthUrlBehindViteProxy = (c: { req: { header: (n: string) => string | undefined } }): void => {
  if (env.ENVIRONMENT !== "development") {
    return;
  }
  const headerHost = browserHostForDevAuthUrl(c);
  const host =
    headerHost != null && headerHost.length > 0 ? headerHost : new URL(env.FRONTEND_URL).host;
  const proto = forwardedProtoOrHttp(c.req.header("x-forwarded-proto"));
  const nextAuthUrl = `${proto}://${host}/api/auth`;
  Object.assign(Bun.env, { AUTH_URL: nextAuthUrl });
  Object.assign(process.env, { AUTH_URL: nextAuthUrl });
};

app.use(
  "*",
  cors({
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    origin: resolveOrigin,
  }),
);

app.use(
  "*",
  secureHeaders({
    crossOriginResourcePolicy: false,
  }),
);
app.use("*", csrf());

app.use(
  "/api/auth/*",
  rateLimit({
    keyGenerator: undefined,
    limit: 60,
    windowMs: 60_000,
  }),
);

app.use(
  "/api/register",
  rateLimit({
    keyGenerator: undefined,
    limit: 20,
    windowMs: 60_000,
  }),
);

app.use("*", async (c, next): Promise<void> => {
  c.set("db", db);
  await next();
});

app.use("*", async (c, next): Promise<void> => {
  syncDevAuthUrlBehindViteProxy(c);
  await next();
});

const drizzleAuthConfig = createAuthConfig({
  appEnv: env,
  database: db,
  oauthEncryptionKey: env.OAUTH_TOKEN_ENCRYPTION_KEY,
});

app.use(
  "*",
  initAuthConfig(() => drizzleAuthConfig),
);

app.use("/api/auth/*", authHandler());

mountApiRoutes(app);

app.get("/api/health", (c) => {
  return c.json({ message: "ok" });
});

app.use(
  "/uploads/*",
  serveStatic({
    root: "./public",
  }),
);

app.get("/", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

const isPortTaken = async (port: number): Promise<boolean> => {
  const [socket] = await tryCatchAsync(() =>
    Bun.connect({
      hostname: "localhost",
      port,
      socket: {
        close: () => {},
        data: () => {},
        error: () => {},
        open: (s) => {
          s.end();
        },
      },
    }),
  );
  return socket !== null;
};

const findFreePort = async (port: number): Promise<number> => {
  const taken = await isPortTaken(port);
  return taken ? findFreePort(port + 1) : port;
};

const port = await findFreePort(env.PORT);

if (port !== env.PORT) {
  process.stdout.write(`Port ${String(env.PORT)} is in use, using port ${String(port)}\n`);
}

process.stdout.write(`Listening on port ${String(port)}\n`);

export default {
  fetch: app.fetch,
  port,
};
