import type { Hono } from "hono";
import { raise } from "@padraosistema/lib";
import { createAuthConfig } from "~/auth/createAuthConfig";
import type { AppDb } from "~/db/index";
import { createApiAppWithExport } from "~/test/exportRoutingTestKit";
import {
  closeTestDatabase,
  deleteUserCascadePatterns,
  insertTestUser,
  openTestDatabase,
} from "~/test/patternVersioningTestKit";
import type { AppVariables } from "~/types/app";

const testingAuthEnv = () => {
  return {
    AUTH_SECRET: Bun.env.AUTH_SECRET ?? raise("AUTH_SECRET"),
    ENVIRONMENT: "testing" as const,
    FRONTEND_URL: "http://localhost:5173",
    GOOGLE_CLIENT_ID: Bun.env.GOOGLE_CLIENT_ID ?? raise("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: Bun.env.GOOGLE_CLIENT_SECRET ?? raise("GOOGLE_CLIENT_SECRET"),
  } as const;
};

export type SingleUserExportContext = {
  after: () => Promise<void>;
  app: Hono<{ Variables: AppVariables }>;
  database: AppDb;
  userId: string;
};

export const openSingleUserExportContext = async (): Promise<SingleUserExportContext> => {
  const opened = await openTestDatabase();
  const userId = await insertTestUser(opened.db);
  const authConfig = createAuthConfig({
    appEnv: testingAuthEnv(),
    database: opened.db,
    oauthEncryptionKey: undefined,
  });
  const app = createApiAppWithExport({ authConfig, database: opened.db, userId });
  return {
    after: async (): Promise<void> => {
      await deleteUserCascadePatterns({ database: opened.db, userId });
      await closeTestDatabase(opened.client);
    },
    app,
    database: opened.db,
    userId,
  };
};

export type TwoUserExportContext = {
  after: () => Promise<void>;
  appA: Hono<{ Variables: AppVariables }>;
  appB: Hono<{ Variables: AppVariables }>;
  database: AppDb;
  userA: string;
  userB: string;
};

export const openTwoUserExportContext = async (): Promise<TwoUserExportContext> => {
  const opened = await openTestDatabase();
  const userA = await insertTestUser(opened.db);
  const userB = await insertTestUser(opened.db);
  const authConfig = createAuthConfig({
    appEnv: testingAuthEnv(),
    database: opened.db,
    oauthEncryptionKey: undefined,
  });
  const appA = createApiAppWithExport({ authConfig, database: opened.db, userId: userA });
  const appB = createApiAppWithExport({ authConfig, database: opened.db, userId: userB });
  return {
    after: async (): Promise<void> => {
      await deleteUserCascadePatterns({ database: opened.db, userId: userA });
      await deleteUserCascadePatterns({ database: opened.db, userId: userB });
      await closeTestDatabase(opened.client);
    },
    appA,
    appB,
    database: opened.db,
    userA,
    userB,
  };
};
