import type { Pattern } from "@padraosistema/lib";
import React from "react";
import { CartDrawerRow } from "./CartDrawerRow";

type Props = {
  categoryLabel: (category: string) => string;
  items: readonly string[];
  patternById: Map<string, Pattern>;
  removeItem: (id: string) => void;
};

export const CartDrawerItemList: React.FC<Props> = ({
  categoryLabel,
  items,
  patternById,
  removeItem,
}) => {
  return (
    <ul className="flex flex-col">
      {items.map((id) => {
        const pattern = patternById.get(id);
        const title = pattern == null ? `ID ${id.slice(0, 8)}…` : pattern.title;
        const cat = pattern == null ? "—" : categoryLabel(pattern.category);
        return (
          <CartDrawerRow
            key={id}
            categoryLabel={cat}
            patternId={id}
            title={title}
            onRemoveItem={removeItem}
          />
        );
      })}
    </ul>
  );
};
