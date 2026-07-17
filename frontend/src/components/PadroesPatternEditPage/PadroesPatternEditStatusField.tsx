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
      <label htmlFor="edit-status" className="text-sm text-muted-foreground">
        Status
      </label>
      <select
        id="edit-status"
        disabled={canEdit === false}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
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
