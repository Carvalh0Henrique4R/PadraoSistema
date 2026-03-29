import { signOut } from "@hono/auth-js/react";
import { LogOut } from "lucide-react";
import React from "react";
import { usePadroesHeaderDropdownDismiss } from "../usePadroesHeaderDropdownDismiss";

const iconClass = "h-4 w-4 shrink-0";

type Props = {
  displayName: string;
};

export const PadroesHeaderUserMenu: React.FC<Props> = ({ displayName }) => {
  const menuPanelId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  usePadroesHeaderDropdownDismiss({ open, rootRef, setOpen });

  const handleToggleOpen = React.useCallback((): void => {
    setOpen((prev) => !prev);
  }, []);

  const handleLogout = React.useCallback((): void => {
    setOpen(false);
    void signOut();
  }, []);

  return (
    <div ref={rootRef} className="relative flex min-w-0 shrink-0">
      <button
        type="button"
        aria-controls={menuPanelId}
        aria-expanded={open}
        aria-haspopup="true"
        className="max-w-44 truncate rounded-lg border border-transparent px-2 py-1.5 text-left text-sm font-medium text-slate-200 transition-colors duration-150 hover:border-white/15 hover:bg-white/5 hover:text-white"
        title={displayName}
        onClick={handleToggleOpen}
      >
        {displayName}
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-20 flex flex-col pt-2">
          <div
            className="min-w-44 rounded-lg border border-white/10 bg-slate-900/95 py-1 shadow-lg shadow-black/40"
            id={menuPanelId}
            role="menu"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 transition-colors duration-150 hover:bg-white/10"
              role="menuitem"
              onClick={handleLogout}
            >
              <LogOut aria-hidden className={iconClass} data-lucide="log-out" />
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
