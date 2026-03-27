import type { ReactEventHandler } from "react";
import { tryCatchAsync } from "@padraosistema/lib";
import type { LoginFormSubmitEvent } from "./loginForm.types";

export const wrapLoginFormSubmit = (
  handleCredentialsSubmit: (event: LoginFormSubmitEvent) => Promise<void>,
): ReactEventHandler<HTMLFormElement> => {
  const handler: ReactEventHandler<HTMLFormElement> = (event) => {
    const ev: LoginFormSubmitEvent = {
      preventDefault: (): void => {
        event.preventDefault();
      },
    };
    void tryCatchAsync(async () => {
      await handleCredentialsSubmit(ev);
    });
  };
  return handler;
};
