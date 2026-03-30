import React from "react";

export const PadroesPatternEditReadOnlyBanner: React.FC = () => {
  return (
    <p className="max-w-4xl rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:text-amber-200">
      Você está visualizando este padrão. Apenas o autor pode editar ou excluir.
    </p>
  );
};
