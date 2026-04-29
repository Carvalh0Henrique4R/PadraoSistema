import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { useCart } from "~/hooks/useCart";
import { useSession } from "~/hooks/useSession";

type Props = {
  pattern: Pattern;
};

export const PadroesPatternListItemAddToCartButton: React.FC<Props> = ({ pattern }) => {
  const { status } = useSession();
  const { addItem, isInCart, removeItem } = useCart();

  const handleAddClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addItem(pattern.id);
    },
    [addItem, pattern.id],
  );

  const handleRemoveClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      removeItem(pattern.id);
    },
    [pattern.id, removeItem],
  );

  if (status !== "authenticated") {
    return null;
  }

  if (isInCart(pattern.id)) {
    return (
      <button
        type="button"
        onClick={handleRemoveClick}
        className="flex shrink-0 items-center rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2 py-2 text-sm font-semibold text-emerald-800 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        aria-label="Remover do carrinho de exportação"
      >
        ✓
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddClick}
      className="flex shrink-0 items-center rounded-md border border-slate-300 bg-slate-200 px-2 py-2 text-sm font-semibold text-slate-900 hover:border-indigo-500/60 hover:bg-slate-300/80 dark:border-white/15 dark:bg-slate-800/80 dark:text-white dark:hover:border-indigo-500/50 dark:hover:bg-slate-800"
      aria-label="Adicionar ao carrinho de exportação"
    >
      +
    </button>
  );
};
