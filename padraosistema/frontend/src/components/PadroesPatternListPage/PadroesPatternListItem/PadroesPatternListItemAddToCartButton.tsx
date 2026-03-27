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
        className="flex shrink-0 items-center rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-2 text-sm font-semibold text-emerald-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
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
      className="flex shrink-0 items-center rounded-md border border-white/15 bg-slate-800/80 px-2 py-2 text-sm font-semibold text-white hover:border-indigo-500/50 hover:bg-slate-800"
      aria-label="Adicionar ao carrinho de exportação"
    >
      +
    </button>
  );
};
