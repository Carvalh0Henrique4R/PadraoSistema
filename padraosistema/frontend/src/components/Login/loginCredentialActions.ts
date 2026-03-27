import { signIn } from "@hono/auth-js/react";

import { tryCatchAsync } from "@padraosistema/lib";

import { registerWithPassword } from "~/api/register";



type Mode = "login" | "register";



const messageCredentialsInvalid = "Não foi possível entrar. Verifique e-mail e senha.";

const messageNetworkError = "Não foi possível concluir o login. Tente novamente.";



export const toAbsoluteCallbackUrl = (redirectUrl: string): string => {

  if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {

    return redirectUrl;

  }

  if (typeof window === "undefined") {

    return redirectUrl;

  }

  return new URL(redirectUrl, window.location.origin).href;

};



const registerIfNeeded = async (params: {

  email: string;

  mode: Mode;

  name: string;

  password: string;

}): Promise<{ message: string } | null> => {

  if (params.mode !== "register") {

    return null;

  }

  const [, regErr] = await tryCatchAsync(() =>

    registerWithPassword({

      email: params.email,

      name: params.name,

      password: params.password,

    }),

  );

  if (regErr != null) {

    return { message: regErr.message };

  }

  return null;

};



const hasNonEmptyErrorField = (value: unknown): boolean => {

  if (typeof value !== "string") {

    return false;

  }

  return value.length > 0;

};



const finalizeAfterSignIn = (signResult: unknown): { message: string } | null => {

  if (signResult == null) {

    return null;

  }

  if (typeof signResult !== "object") {

    return { message: messageNetworkError };

  }

  const okRaw: unknown = Reflect.get(signResult, "ok");

  if (typeof okRaw !== "boolean") {

    return { message: messageNetworkError };

  }

  if (!okRaw) {

    return { message: messageCredentialsInvalid };

  }

  const errRaw: unknown = Reflect.get(signResult, "error");

  if (hasNonEmptyErrorField(errRaw)) {

    return { message: messageCredentialsInvalid };

  }

  return null;

};



export const submitLoginOrRegister = async (params: {

  email: string;

  mode: Mode;

  name: string;

  password: string;

  redirectUrl: string;

}): Promise<{ message: string } | null> => {

  const regOutcome = await registerIfNeeded(params);

  if (regOutcome != null) {

    return regOutcome;

  }

  const callbackUrl = toAbsoluteCallbackUrl(params.redirectUrl);

  const [signResult, signErr] = await tryCatchAsync(() =>

    signIn("credentials", {

      callbackUrl,

      email: params.email,

      password: params.password,

      redirect: false,

    }),

  );

  if (signErr != null) {

    return { message: messageNetworkError };

  }

  return finalizeAfterSignIn(signResult);

};

