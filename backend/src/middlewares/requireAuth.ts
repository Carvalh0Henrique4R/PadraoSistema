import { getAuthUser } from "@hono/auth-js";
import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { raise } from "@padraosistema/lib";
import type { AuthenticatedUser, AppVariables } from "~/types/app";

type AuthParams = NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;

const requireNonEmptyString = (value: unknown, message: string): string => {
  if (typeof value !== "string") {
    return raise(message);
  }
  if (value.length === 0) {
    return raise(message);
  }
  return value;
};

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const firstNonemptyStringKey = (record: Record<string, unknown>, keys: readonly string[]): string | undefined => {
  const found = keys
    .map((key) => record[key])
    .find((value): value is string => typeof value === "string" && value.length > 0);
  return found;
};

const hasAuthenticatedSession = (p: AuthParams): boolean => {
  if ("token" in p && p.token != null && isPlainRecord(p.token)) {
    return Object.keys(p.token).length > 0;
  }
  return "user" in p && p.user != null;
};

const toAuthenticatedUserFromAdapter = (adapterUser: NonNullable<AuthParams["user"]>): AuthenticatedUser => {
  const id = requireNonEmptyString(adapterUser.id, "Session user missing id");
  const email = requireNonEmptyString(adapterUser.email, "Session user missing email");
  return { email, id, name: adapterUser.name ?? "" };
};

const toAuthenticatedUserFromJwt = (token: Record<string, unknown>): AuthenticatedUser => {
  const id = requireNonEmptyString(
    firstNonemptyStringKey(token, ["sub", "id"]),
    "Session token missing id",
  );
  const email = requireNonEmptyString(
    firstNonemptyStringKey(token, ["email"]),
    "Session token missing email",
  );
  const name = firstNonemptyStringKey(token, ["name"]) ?? "";
  return { email, id, name };
};

const toAuthenticatedUser = (p: AuthParams): AuthenticatedUser => {
  if ("user" in p && p.user != null) {
    return toAuthenticatedUserFromAdapter(p.user);
  }
  if ("token" in p && p.token != null && isPlainRecord(p.token) && Object.keys(p.token).length > 0) {
    return toAuthenticatedUserFromJwt(p.token);
  }
  return raise("Session missing user or JWT claims");
};

export const requireAuth: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (c, next): Promise<void> => {
  const params = await getAuthUser(c);
  if (params == null) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  if (!hasAuthenticatedSession(params)) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const user = toAuthenticatedUser(params);
  c.set("user", user);
  await next();
};
