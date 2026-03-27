import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<PatternInput>;
};

export const NovoPatternModalTitleField: React.FC<Props> = ({ register }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="padrao-titulo" className="text-sm text-slate-300">
        Título
      </label>
      <input
        id="padrao-titulo"
        type="text"
        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        {...register("title", { required: true })}
      />
    </div>
  );
};
