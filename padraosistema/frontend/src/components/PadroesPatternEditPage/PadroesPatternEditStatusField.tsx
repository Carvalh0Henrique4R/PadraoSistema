import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { PATTERN_STATUS_LABELS, PATTERN_STATUS_ORDER } from "~/constants/patternStatus";

type Props = {
  canEdit: boolean;
  register: UseFormRegister<PatternInput>;
};

export const PadroesPatternEditStatusField: React.FC<Props> = ({ canEdit, register }) => {
  return (
    <div className="flex min-w-64 flex-col gap-2">
      <label htmlFor="edit-status" className="text-sm text-slate-300">
        Status
      </label>
      <select
        id="edit-status"
        disabled={canEdit === false}
        className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        {...register("status", { required: true })}
      >
        {PATTERN_STATUS_ORDER.map((key) => (
          <option key={key} value={key}>
            {PATTERN_STATUS_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  );
};
