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
    <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300" htmlFor="login-password">
      Senha
      <input
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
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
