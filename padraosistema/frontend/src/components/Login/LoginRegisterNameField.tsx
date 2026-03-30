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
    <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300" htmlFor="reg-name">
      Nome
      <input
        autoComplete="name"
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
        id="reg-name"
        value={name}
        onChange={onChange}
        required
        type="text"
      />
    </label>
  );
};
