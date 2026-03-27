import type { AuthConfig } from "@auth/core";
import type { AppDb } from "~/db/index";

export type AuthenticatedUser = {
  email: string;
  id: string;
  name: string;
};

export type AppVariables = {
  authConfig: AuthConfig;
  db: AppDb;
  user: AuthenticatedUser | undefined;
};
