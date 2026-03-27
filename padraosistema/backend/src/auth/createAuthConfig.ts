import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { accounts, sessions, verificationTokens } from "~/db/schema/auth";
import { users } from "~/db/schema/users";
import { createSecureAdapter } from "~/security/secureAdapter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { AuthConfig } from "@auth/core";
import type { AdapterUser } from "@auth/core/adapters";
import type { JWT } from "@auth/core/jwt";
import type { Session, User } from "@auth/core/types";
import type { env } from "~/env/env";
import type { AppDb } from "~/db/index";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

type CreateAuthConfigParams = {
  database: AppDb;
  oauthEncryptionKey: NonNullable<(typeof env)["OAUTH_TOKEN_ENCRYPTION_KEY"]> | undefined;
  appEnv: Pick<
    typeof env,
    "AUTH_SECRET" | "ENVIRONMENT" | "FRONTEND_URL" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET"
  >;
};

type SessionCookieOptions = {
  httpOnly: boolean;
  path: string;
  sameSite: "lax";
  secure: boolean;
};

const buildSessionCookieOptions = (secure: boolean): SessionCookieOptions => {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
};

const applyUserIdToJwtToken = (token: JWT, user: User | AdapterUser): JWT => {
  const rawId = user.id;
  if (rawId == null) {
    return token;
  }
  const id = String(rawId);
  if (id.length === 0) {
    return token;
  }
  return { ...token, id, sub: id };
};

const extendJwtWithUserId: NonNullable<AuthConfig["callbacks"]>["jwt"] = ({ token, user }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Auth.js calls `jwt` without `user` after sign-in; types omit that.
  if (user == null) {
    return token;
  }
  return applyUserIdToJwtToken(token, user);
};

const tokenStringField = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const sessionUserMergedFromJwt = (params: {
  id: string;
  session: Session;
  token: JWT;
}): NonNullable<Session["user"]> => {
  const { id, session, token } = params;
  const base = session.user;
  return {
    ...base,
    email: base.email ?? tokenStringField(token.email),
    id,
    image: base.image ?? tokenStringField(token.picture),
    name: base.name ?? tokenStringField(token.name),
  };
};

/** Credentials provider does not create DB sessions; Auth.js requires JWT strategy for password sign-in. */
const mapJwtToClientSession = (session: Session, token: JWT): Session => {
  const rawSub = token.sub ?? (typeof token.id === "string" ? token.id : undefined);
  if (rawSub == null) {
    return session;
  }
  const id = String(rawSub);
  return {
    ...session,
    user: sessionUserMergedFromJwt({ id, session, token }),
  };
};

const authSessionCallbackInner = (params: { session: Session; token: JWT }): Session => {
  return mapJwtToClientSession(params.session, params.token);
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Auth session params are a union; with `strategy: "jwt"` we only receive `{ session, token }`.
const authSessionCallback = authSessionCallbackInner as NonNullable<AuthConfig["callbacks"]>["session"];

export const createAuthConfig = ({ appEnv, database, oauthEncryptionKey }: CreateAuthConfigParams): AuthConfig => {
  const useSecureCookies = appEnv.ENVIRONMENT === "production";
  const cookieOpts = buildSessionCookieOptions(useSecureCookies);
  const isDev = appEnv.ENVIRONMENT === "development";
  return {
    adapter: createSecureAdapter(
      DrizzleAdapter(database, {
        accountsTable: accounts,
        sessionsTable: sessions,
        usersTable: users,
        verificationTokensTable: verificationTokens,
      }),
      { oauthEncryptionKey },
    ),
    basePath: "/api/auth",
    cookies: {
      callbackUrl: { options: { ...cookieOpts } },
      csrfToken: { options: { ...cookieOpts } },
      sessionToken: { options: { ...cookieOpts } },
    },
    callbacks: {
      jwt: extendJwtWithUserId,
      redirect({ baseUrl, url }): string {
        const frontendUrl = appEnv.FRONTEND_URL;
        const frontendOrigin = new URL(frontendUrl).origin;
        const backendOrigin = new URL(baseUrl).origin;
        if (url.startsWith("/")) {
          return `${frontendUrl}${url}`;
        }
        const urlObj = new URL(url);
        if (urlObj.origin === backendOrigin) {
          return frontendUrl;
        }
        if (urlObj.origin === frontendOrigin) {
          return url;
        }
        return frontendUrl;
      },
      session: authSessionCallback,
    },
    debug: isDev,
    providers: [
      Google({
        clientId: appEnv.GOOGLE_CLIENT_ID,
        clientSecret: appEnv.GOOGLE_CLIENT_SECRET,
      }),
      Credentials({
        credentials: {
          email: { label: "Email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials): Promise<{ email: string; id: string; name: string } | null> {
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) {
            return null;
          }
          const rows = await database.select().from(users).where(eq(users.email, parsed.data.email.toLowerCase()));
          if (rows.length === 0) {
            return null;
          }
          const row = rows[0];
          const ph = row.passwordHash;
          if (ph == null) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(parsed.data.password, ph);
          if (!passwordsMatch) {
            return null;
          }
          return { email: row.email, id: String(row.id), name: row.name };
        },
      }),
    ],
    secret: appEnv.AUTH_SECRET,
    /**
     * JWT is required for the Credentials provider (no DB session row). Reverting to `strategy: "database"`
     * breaks email/password login: `/api/auth/session` stays empty and the app loops on `/login`.
     */
    session: { maxAge: 30 * 24 * 60 * 60, strategy: "jwt" },
    /** Required behind Vite (and most reverse proxies); dev-only forwarded-host sync sets AUTH_URL to the browser origin. */
    trustHost: true,
    useSecureCookies,
  };
};
