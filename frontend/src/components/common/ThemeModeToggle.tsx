import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "~/hooks/useTheme";
import { cn } from "~/lib/cn";

type Props = {
  className?: string | undefined;
  menuRole?: boolean | undefined;
  showLabel?: boolean | undefined;
};

export const ThemeModeToggle: React.FC<Props> = ({ className, menuRole, showLabel }) => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = React.useCallback((): void => {
    toggleTheme();
  }, [toggleTheme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={isDark}
      className={cn(
        "group flex cursor-pointer items-center outline-none transition-[transform,opacity] duration-200 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900",
        "active:opacity-90 active:duration-150",
        showLabel === true
          ? "min-h-11 w-full justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/10"
          : "min-h-11 min-w-[3.25rem] justify-center rounded-lg px-2 py-2 hover:bg-slate-100/80 dark:hover:bg-white/5",
        className,
      )}
      role={menuRole === true ? "menuitem" : undefined}
      onClick={handleClick}
    >
      {showLabel === true ? (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tema</span>
      ) : null}
      <div
        className={cn(
          "pointer-events-none relative h-7 w-[52px] shrink-0 rounded-full border border-gray-400/40 bg-gray-300 p-0.5 shadow-inner transition-colors duration-300 ease-in-out",
          "group-hover:border-gray-400 group-hover:bg-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:group-hover:border-gray-500 dark:group-hover:bg-gray-600",
          "group-active:brightness-95 dark:group-active:brightness-90",
        )}
        aria-hidden
      >
        <div
          className={cn(
            "absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-in-out",
            "start-0.5",
            "dark:bg-gray-500 dark:ring-white/20",
            isDark ? "translate-x-[1.5rem]" : "translate-x-0",
          )}
        >
          {isDark ? (
            <Moon aria-hidden className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          ) : (
            <Sun aria-hidden className="h-3.5 w-3.5 text-gray-800" strokeWidth={2} />
          )}
        </div>
      </div>
    </button>
  );
};
