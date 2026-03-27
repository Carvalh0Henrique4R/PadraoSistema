import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { PATTERN_CATEGORY_LABELS, PATTERN_CATEGORY_SLUGS } from "~/constants/patternCategories";
import { PATTERN_STATUS_LABELS, PATTERN_STATUS_ORDER } from "~/constants/patternStatus";

type Props = {
  register: UseFormRegister<PatternInput>;
};

export const NovoPatternModalCategoryStatusRow: React.FC<Props> = ({ register }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor="padrao-categoria" className="text-sm text-slate-300">
          Categoria
        </label>
        <select
          id="padrao-categoria"
          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          {...register("category", { required: true })}
        >
          {PATTERN_CATEGORY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {PATTERN_CATEGORY_LABELS[slug]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor="padrao-status" className="text-sm text-slate-300">
          Status
        </label>
        <select
          id="padrao-status"
          className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          {...register("status", { required: true })}
        >
          {PATTERN_STATUS_ORDER.map((key) => (
            <option key={key} value={key}>
              {PATTERN_STATUS_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
