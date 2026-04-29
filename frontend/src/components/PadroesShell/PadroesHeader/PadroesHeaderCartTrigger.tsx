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
      className="relative flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:border-indigo-400 hover:bg-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-white/15 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900 dark:focus-visible:ring-indigo-400/80"
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
        <span className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : String(count)}
        </span>
      ) : null}
    </button>
  );
};
