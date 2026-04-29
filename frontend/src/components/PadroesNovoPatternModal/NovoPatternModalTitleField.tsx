import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<PatternInput>;
};

export const NovoPatternModalTitleField: React.FC<Props> = ({ register }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="padrao-titulo" className="text-sm text-slate-700 dark:text-slate-300">
        Título
      </label>
      <input
        id="padrao-titulo"
        type="text"
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
        {...register("title", { required: true })}
      />
    </div>
  );
};
