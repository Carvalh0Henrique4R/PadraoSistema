import React from "react";

export const PadroesPatternListCategoryEmpty: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="text-sm text-slate-400">Nenhum padrão nesta categoria.</p>
    </div>
  );
};
