import type { PointerEvent } from "react";

export const importModalStopDialogPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
  event.stopPropagation();
};
