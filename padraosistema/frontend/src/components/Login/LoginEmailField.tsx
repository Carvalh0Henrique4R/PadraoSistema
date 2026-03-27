import React from "react";

type Props = {
  email: string;
  setEmail: (value: string) => void;
};

export const LoginEmailField: React.FC<Props> = ({ email, setEmail }) => {
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(ev.target.value);
  };
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300" htmlFor="login-email">
      E-mail
      <input
        autoComplete="email"
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        id="login-email"
        value={email}
        onChange={onChange}
        required
        type="email"
      />
    </label>
  );
};
