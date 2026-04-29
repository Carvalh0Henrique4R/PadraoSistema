import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { PadroesPatternEditCategoryField } from "./PadroesPatternEditCategoryField";
import { PadroesPatternEditStatusField } from "./PadroesPatternEditStatusField";
import { PadroesPatternEditTitleField } from "./PadroesPatternEditTitleField";

type Props = {
  canEdit: boolean;
  categoryOptions: string[];
  register: UseFormRegister<PatternInput>;
};

export const PadroesPatternEditMetaRow: React.FC<Props> = ({ canEdit, categoryOptions, register }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <PadroesPatternEditTitleField canEdit={canEdit} register={register} />
      <PadroesPatternEditCategoryField canEdit={canEdit} categoryOptions={categoryOptions} register={register} />
      <PadroesPatternEditStatusField canEdit={canEdit} register={register} />
    </div>
  );
};
