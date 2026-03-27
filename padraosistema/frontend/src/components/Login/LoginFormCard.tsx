import React from "react";
import { LoginFormCardView } from "./LoginFormCardView";
import type { LoginFlowResult } from "./loginFlowResult";
import { wrapLoginFormSubmit } from "./wrapLoginFormSubmit";

type Props = Pick<
  LoginFlowResult,
  | "email"
  | "handleCredentialsSubmit"
  | "handleGoogleClick"
  | "message"
  | "mode"
  | "name"
  | "password"
  | "pending"
  | "setEmail"
  | "setName"
  | "setPassword"
  | "toggleMode"
>;

export const LoginFormCard: React.FC<Props> = (props) => {
  const { handleCredentialsSubmit, ...rest } = props;
  const onSubmit = wrapLoginFormSubmit(handleCredentialsSubmit);
  return <LoginFormCardView {...rest} onSubmit={onSubmit} />;
};
