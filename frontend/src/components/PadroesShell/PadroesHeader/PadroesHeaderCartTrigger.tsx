import React from "react";
import { useCart } from "~/hooks/useCart";
import { useSession } from "~/hooks/useSession";

export const PadroesHeaderCartTrigger: React.FC = () => {
  const { status } = useSession();
  const { items, openDrawer } = useCart();

  const handleClick = React.useCallback((): void => {
    openDrawer();
  }, [openDrawer]);

  if (status !== "authenticated") {
    return null;
  }

  const count = items.length;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex shrink-0 items-center justify-center rounded-md border border-[#e7ecea] bg-[#f7f8f8] p-2 text-[#52615d] hover:border-[#0b8f7f]/40 hover:bg-[#eef4f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b8f7f]/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-[#0b8f7f]/60 dark:hover:bg-white/10"
      aria-label={`Abrir carrinho, ${String(count)} itens`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          fill="currentColor"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-[#0b8f7f] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : String(count)}
        </span>
      ) : null}
    </button>
  );
};
