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
    <label className="flex flex-col gap-1 text-sm text-slate-300" htmlFor="reg-name">
      Nome
      <input
        autoComplete="name"
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        id="reg-name"
        value={name}
        onChange={onChange}
        required
        type="text"
      />
    </label>
  );
};
