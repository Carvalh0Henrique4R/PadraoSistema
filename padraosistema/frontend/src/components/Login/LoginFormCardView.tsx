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
    <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-white/10 bg-slate-900/80 p-8">
      <h1 className="text-center text-2xl font-semibold">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      {message.length === 0 ? null : (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{message}</p>
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {mode === "register" ? <LoginRegisterNameField name={name} setName={setName} /> : null}
        <LoginEmailField email={email} setEmail={setEmail} />
        <LoginPasswordField mode={mode} password={password} setPassword={setPassword} />
        <button
          className="rounded-lg bg-indigo-500 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {mode === "login" ? "Entrar" : "Registrar"}
        </button>
      </form>
      <button
        className="flex flex-row items-center justify-center gap-2 rounded-lg border border-white/15 bg-white py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        onClick={handleGoogleClick}
        type="button"
      >
        <GoogleMark />
        Entrar com Google
      </button>
      <button className="text-center text-sm text-indigo-300 hover:text-indigo-200" onClick={toggleMode} type="button">
        {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
      </button>
    </div>
  );
};
