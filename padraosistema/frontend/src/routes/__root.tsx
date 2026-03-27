import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { SessionProvider, authConfigManager } from "@hono/auth-js/react";
import React from "react";
import { queryClient } from "~/api/queryClient";
import { FlashMessageProvider } from "~/context/FlashMessageContext";
import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const RootLayout = (): ReactNode => {
  React.useLayoutEffect(() => {
    authConfigManager.setConfig({
      basePath: "/api/auth",
      baseUrl: window.location.origin,
      credentials: "include",
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <FlashMessageProvider>
          <Outlet />
        </FlashMessageProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
