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
    <label className="flex flex-col gap-1 text-sm text-muted-foreground" htmlFor="login-email">
      E-mail
      <input
        autoComplete="email"
        className="rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
        id="login-email"
        value={email}
        onChange={onChange}
        required
        type="email"
      />
    </label>
  );
};
