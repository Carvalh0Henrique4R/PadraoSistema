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
    <label className="flex flex-col gap-1 text-sm text-muted-foreground" htmlFor="login-password">
      Senha
      <input
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        className="rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
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
