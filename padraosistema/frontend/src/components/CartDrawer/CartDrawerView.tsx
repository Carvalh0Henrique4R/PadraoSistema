import React from "react";
import { PATTERN_CATEGORY_LABELS, isPatternCategorySlug } from "~/constants/patternCategories";
import { CartDrawerExportFooter } from "./CartDrawerExportFooter";
import { CartDrawerItemList } from "./CartDrawerItemList";
import type { CartDrawerModel } from "./useCartDrawerModel";

const categoryLabel = (category: string): string => {
  if (isPatternCategorySlug(category)) {
    return PATTERN_CATEGORY_LABELS[category];
  }
  return category;
};

type Props = Omit<CartDrawerModel, "isDrawerOpen">;

export const CartDrawerView: React.FC<Props> = ({
  exportError,
  handleBackdropClick,
  handleCloseClick,
  handleExportClick,
  handlePanelClick,
  items,
  patternById,
  removeItem,
}) => {
  const errorBlock =
    exportError === null ? null : <p className="text-sm text-red-600 dark:text-red-400">{exportError}</p>;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[90] flex justify-end bg-slate-900/40 dark:bg-black/60"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-label="Carrinho de exportação"
        className="flex h-full min-w-0 max-w-md flex-none flex-col border-l border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950"
        onClick={handlePanelClick}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Carrinho</h2>
          <button
            type="button"
            onClick={handleCloseClick}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Fechar
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">Nenhum padrão selecionado.</p>
          ) : (
            <CartDrawerItemList
              categoryLabel={categoryLabel}
              items={items}
              patternById={patternById}
              removeItem={removeItem}
            />
          )}
          {errorBlock}
        </div>
        <CartDrawerExportFooter disabled={items.length === 0} onExportClick={handleExportClick} />
      </div>
    </div>
  );
};
