import type { ReactEventHandler } from "react";
import React from "react";
import { GoogleMark } from "./GoogleMark";
import { LoginEmailField } from "./LoginEmailField";
import { LoginPasswordField } from "./LoginPasswordField";
import { LoginRegisterNameField } from "./LoginRegisterNameField";

type Mode = "login" | "register";

type Props = {
  email: string;
  handleGoogleClick: () => void;
  message: string;
  mode: Mode;
  name: string;
  onSubmit: ReactEventHandler<HTMLFormElement>;
  password: string;
  pending: boolean;
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  setPassword: (value: string) => void;
  toggleMode: () => void;
};

export const LoginFormCardView: React.FC<Props> = ({
  email,
  handleGoogleClick,
  message,
  mode,
  name,
  onSubmit,
  password,
  pending,
  setEmail,
  setName,
  setPassword,
  toggleMode,
}) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-lg">
      <h1 className="text-center text-2xl font-semibold text-foreground">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      {message.length === 0 ? null : (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {message}
        </p>
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {mode === "register" ? <LoginRegisterNameField name={name} setName={setName} /> : null}
        <LoginEmailField email={email} setEmail={setEmail} />
        <LoginPasswordField mode={mode} password={password} setPassword={setPassword} />
        <button
          className="rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/85 disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {mode === "login" ? "Entrar" : "Registrar"}
        </button>
      </form>
      <button
        className="flex flex-row items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        onClick={handleGoogleClick}
        type="button"
      >
        <GoogleMark />
        Entrar com Google
      </button>
      <button
        className="text-center text-sm font-medium text-primary hover:text-primary/80"
        onClick={toggleMode}
        type="button"
      >
        {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
      </button>
    </div>
  );
};
