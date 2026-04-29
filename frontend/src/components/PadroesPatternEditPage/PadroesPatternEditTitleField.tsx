import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";

type Props = {
  canEdit: boolean;
  register: UseFormRegister<PatternInput>;
};

export const PadroesPatternEditTitleField: React.FC<Props> = ({ canEdit, register }) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor="edit-titulo" className="text-sm text-slate-700 dark:text-slate-300">
        Título
      </label>
      <input
        id="edit-titulo"
        type="text"
        readOnly={canEdit === false}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
        {...register("title", { required: true })}
      />
    </div>
  );
};
