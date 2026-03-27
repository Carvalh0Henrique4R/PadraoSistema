import React from "react";

type Params = {
  open: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const usePadroesHeaderAccountMenuDismiss = (params: Params): void => {
  const { open, rootRef, setOpen } = params;

  React.useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      const root = rootRef.current;
      const { target } = event;
      if (root == null) {
        return;
      }
      if (!(target instanceof Node)) {
        return;
      }
      if (root.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return (): void => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef, setOpen]);
};
