import { signIn } from "@hono/auth-js/react";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useSession } from "~/hooks/useSession";
import type { LoginFormSubmitEvent } from "./loginForm.types";
import type { LoginFlowResult } from "./loginFlowResult";
import { submitLoginOrRegister, toAbsoluteCallbackUrl } from "./loginCredentialActions";
import { useLoginRedirectOnAuth } from "./useLoginRedirectOnAuth";

type Mode = "login" | "register";

export const useLoginFlow = (redirectAfterLogin: string | undefined): LoginFlowResult => {
  const { status } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("login");
  const [message, setMessage] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const resolvedRedirect = redirectAfterLogin ?? "/patterns";

  useLoginRedirectOnAuth({ navigate, resolvedRedirect, status });

  const handleGoogleClick = (): void => {
    void signIn("google", { callbackUrl: toAbsoluteCallbackUrl(resolvedRedirect) });
  };

  const handleCredentialsSubmit = async (event: LoginFormSubmitEvent): Promise<void> => {
    event.preventDefault();
    setMessage("");
    setPending(true);
    const result = await submitLoginOrRegister({
      email,
      mode,
      name,
      password,
      redirectUrl: resolvedRedirect,
    });
    setPending(false);
    if (result != null) {
      setMessage(result.message);
      return;
    }
    globalThis.location.assign(toAbsoluteCallbackUrl(resolvedRedirect));
  };

  const toggleMode = (): void => {
    setMode(mode === "login" ? "register" : "login");
  };

  return {
    email,
    handleCredentialsSubmit,
    handleGoogleClick,
    message,
    mode,
    name,
    password,
    pending,
    setEmail,
    setName,
    setPassword,
    status,
    toggleMode,
  };
};
