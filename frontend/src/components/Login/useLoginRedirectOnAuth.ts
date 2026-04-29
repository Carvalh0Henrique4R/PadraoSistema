import type { useNavigate } from "@tanstack/react-router";
import React from "react";

type AppNavigateFn = ReturnType<typeof useNavigate>;

type Params = {
  navigate: AppNavigateFn;
  resolvedRedirect: string;
  status: "authenticated" | "loading" | "unauthenticated";
};

export const useLoginRedirectOnAuth = (params: Params): void => {
  const { navigate, resolvedRedirect, status } = params;
  React.useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    queueMicrotask(() => {
      void navigate({ to: resolvedRedirect });
    });
  }, [navigate, resolvedRedirect, status]);
};
