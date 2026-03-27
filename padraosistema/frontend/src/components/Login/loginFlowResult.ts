import type React from "react";
import type { LoginFormSubmitEvent } from "./loginForm.types";

type Mode = "login" | "register";

export type LoginFlowResult = {
  email: string;
  handleCredentialsSubmit: (event: LoginFormSubmitEvent) => Promise<void>;
  handleGoogleClick: () => void;
  message: string;
  mode: Mode;
  name: string;
  password: string;
  pending: boolean;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  status: "authenticated" | "loading" | "unauthenticated";
  toggleMode: () => void;
};
