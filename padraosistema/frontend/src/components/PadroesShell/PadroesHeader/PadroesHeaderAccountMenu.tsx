import { signOut } from "@hono/auth-js/react";
import { Cog, LogOut } from "lucide-react";
import React from "react";
import { usePadroesHeaderAccountMenuDismiss } from "./usePadroesHeaderAccountMenuDismiss";

const iconClass = "h-4 w-4 shrink-0";

const handleSignOut = (): void => {
  void signOut();
};

export const PadroesHeaderAccountMenu: React.FC = () => {
  const menuPanelId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  usePadroesHeaderAccountMenuDismiss({ open, rootRef, setOpen });

  const handleToggleOpen = React.useCallback((): void => {
    setOpen((prev) => !prev);
  }, []);

  const handleLogout = React.useCallback((): void => {
    setOpen(false);
    handleSignOut();
  }, []);

  return (
    <div ref={rootRef} className="relative flex shrink-0">
      <button
        type="button"
        aria-controls={menuPanelId}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
        onClick={handleToggleOpen}
      >
        <Cog aria-hidden className={iconClass} data-lucide="cog" />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-10 flex flex-col pt-2">
          <div
            className="min-w-40 rounded-lg border border-white/10 bg-slate-900/95 py-1 shadow-lg shadow-black/40"
            id={menuPanelId}
            role="menu"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
              role="menuitem"
              onClick={handleLogout}
            >
              <LogOut aria-hidden className={iconClass} data-lucide="log-out" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
