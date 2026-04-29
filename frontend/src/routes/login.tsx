import { createFileRoute, useSearch } from "@tanstack/react-router";
import React from "react";
import { z } from "zod";
import { LoginRoutePage } from "~/components/Login/LoginRoutePage";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

const validateLoginSearch = (raw: unknown): { redirect: string | undefined } => {
  const parsed = loginSearchSchema.safeParse(raw);
  if (!parsed.success) {
    return { redirect: undefined };
  }
  const r = parsed.data.redirect;
  if (r != null && !r.startsWith("/")) {
    return { redirect: undefined };
  }
  return { redirect: r };
};

const LoginPage = (): React.ReactElement => {
  const search = useSearch({ from: "/login" });
  return <LoginRoutePage redirectAfterLogin={search.redirect} />;
};

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: validateLoginSearch,
});
