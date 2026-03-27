import React from "react";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
  password: string;
  setPassword: (value: string) => void;
};

export const LoginPasswordField: React.FC<Props> = ({ mode, password, setPassword }) => {
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(ev.target.value);
  };
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300" htmlFor="login-password">
      Senha
      <input
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        id="login-password"
        value={password}
        minLength={8}
        onChange={onChange}
        required
        type="password"
      />
    </label>
  );
};
