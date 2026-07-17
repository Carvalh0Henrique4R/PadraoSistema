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
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-sm font-semibold text-primary transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
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
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground transition-colors hover:border-ring/40 hover:bg-muted"
      aria-label="Adicionar ao carrinho de exportação"
    >
      +
    </button>
  );
};
