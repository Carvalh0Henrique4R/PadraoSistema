import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { SessionProvider, authConfigManager } from "@hono/auth-js/react";
import React from "react";
import { queryClient } from "~/api/queryClient";
import { FlashMessageProvider } from "~/context/FlashMessageContext";
import { ThemeProvider } from "~/providers/ThemeProvider";
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
      <ThemeProvider>
        <SessionProvider>
          <FlashMessageProvider>
            <Outlet />
          </FlashMessageProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
