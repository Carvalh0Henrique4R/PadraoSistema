import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { PATTERN_CATEGORY_LABELS, isPatternCategorySlug } from "~/constants/patternCategories";

type Props = {
  canEdit: boolean;
  categoryOptions: string[];
  register: UseFormRegister<PatternInput>;
};

export const PadroesPatternEditCategoryField: React.FC<Props> = ({ canEdit, categoryOptions, register }) => {
  return (
    <div className="flex min-w-64 flex-col gap-2">
      <label htmlFor="edit-categoria" className="text-sm text-slate-300">
        Categoria
      </label>
      <select
        id="edit-categoria"
        disabled={canEdit === false}
        className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        {...register("category", { required: true })}
      >
        {categoryOptions.map((slug) => (
          <option key={slug} value={slug}>
            {isPatternCategorySlug(slug) ? PATTERN_CATEGORY_LABELS[slug] : slug}
          </option>
        ))}
      </select>
    </div>
  );
};
