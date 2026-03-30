import { tryCatch } from "@padraosistema/lib";
import React from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

const readStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const [raw, err] = tryCatch(() => window.localStorage.getItem(THEME_STORAGE_KEY));
  if (err != null) {
    return "dark";
  }
  return raw === "light" ? "light" : "dark";
};

const persistTheme = (next: Theme): void => {
  void tryCatch(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  });
};

const applyDomTheme = (next: Theme): void => {
  const root = document.documentElement;
  if (next === "dark") {
    root.classList.add("dark");
    return;
  }
  root.classList.remove("dark");
};

export type ThemeContextValue = {
  setTheme: (next: Theme) => void;
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = React.useState<Theme>(readStoredTheme);

  React.useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme): void => {
    persistTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = React.useCallback((): void => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    (): ThemeContextValue => ({
      setTheme,
      theme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
