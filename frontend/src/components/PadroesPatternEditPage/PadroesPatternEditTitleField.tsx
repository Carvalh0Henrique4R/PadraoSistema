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
      <label htmlFor="edit-titulo" className="text-sm text-muted-foreground">
        Título
      </label>
      <input
        id="edit-titulo"
        type="text"
        readOnly={canEdit === false}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
        {...register("title", { required: true })}
      />
    </div>
  );
};
