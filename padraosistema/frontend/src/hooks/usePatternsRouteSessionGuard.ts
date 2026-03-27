import { authConfigManager, getSession } from "@hono/auth-js/react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { tryCatchAsync } from "@padraosistema/lib";
import React from "react";
import { useSession } from "~/hooks/useSession";

type RouterLocationSlice = {
  location: {
    pathname: string;
  };
};

const selectPathname = (s: RouterLocationSlice): string => s.location.pathname;

const sessionPayloadHasUser = (value: unknown): boolean => {
  if (value == null || typeof value !== "object") {
    return false;
  }
  return Reflect.get(value, "user") != null;
};

type SessionRecheckSetter = (pending: boolean) => void;

type PatternsGuardNavigate = (opts: {
  search: { redirect: string };
  to: "/login";
}) => void | Promise<void>;

type PatternsGuardEffectParams = {
  navigate: PatternsGuardNavigate;
  pathname: string;
  setSessionRecheckPending: SessionRecheckSetter;
  status: "authenticated" | "loading" | "unauthenticated";
};

const subscribePatternsSessionGuardEffect = (
  params: PatternsGuardEffectParams,
): (() => void) | undefined => {
  const { navigate, pathname, setSessionRecheckPending, status } = params;
  if (status === "authenticated") {
    setSessionRecheckPending(false);
    return undefined;
  }
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    setSessionRecheckPending(false);
    return undefined;
  }
  if (status === "loading") {
    return undefined;
  }
  setSessionRecheckPending(true);
  const cancelledRef = { current: false };
  void (async () => {
    await authConfigManager.getConfig().fetchSession({ event: "storage" });
    const snap = await getSession();
    if (cancelledRef.current) {
      return;
    }
    if (sessionPayloadHasUser(snap)) {
      return;
    }
    setSessionRecheckPending(false);
    await tryCatchAsync(async () => {
      await Promise.resolve(navigate({ search: { redirect: pathname }, to: "/login" }));
    });
  })();
  return () => {
    cancelledRef.current = true;
    setSessionRecheckPending(false);
  };
};

export type PatternsRouteGuardState = "loading" | "ready" | "redirecting";

export const usePatternsRouteSessionGuard = (): PatternsRouteGuardState => {
  const { status } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: selectPathname });
  /** Start true so we never treat "unauthenticated" as final before SessionProvider + recheck finish (avoids login loop). */
  const [sessionRecheckPending, setSessionRecheckPending] = React.useState(true);

  React.useEffect(() => {
    return subscribePatternsSessionGuardEffect({
      navigate,
      pathname,
      setSessionRecheckPending,
      status,
    });
  }, [navigate, pathname, status]);

  if (status === "loading") {
    return "loading";
  }
  if (status === "unauthenticated" && sessionRecheckPending) {
    return "loading";
  }
  if (status === "unauthenticated") {
    return "redirecting";
  }
  return "ready";
};
