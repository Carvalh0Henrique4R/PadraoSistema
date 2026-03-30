import React from "react";
import { ThemeContext, type Theme, type ThemeContextValue } from "~/providers/ThemeProvider";

export type { Theme };

export const useTheme = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
