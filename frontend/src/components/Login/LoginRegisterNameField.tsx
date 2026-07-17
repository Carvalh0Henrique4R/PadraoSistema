import React from "react";

type Props = {
  name: string;
  setName: (value: string) => void;
};

export const LoginRegisterNameField: React.FC<Props> = ({ name, setName }) => {
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setName(ev.target.value);
  };
  return (
    <label className="flex flex-col gap-1 text-sm text-muted-foreground" htmlFor="reg-name">
      Nome
      <input
        autoComplete="name"
        className="rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
        id="reg-name"
        value={name}
        onChange={onChange}
        required
        type="text"
      />
    </label>
  );
};
