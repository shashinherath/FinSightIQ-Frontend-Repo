import { useEffect, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  themeUtils,
  useThemeStore,
} from "@/app/store/themeStore";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, resolvedTheme, setTheme, setResolvedTheme } = useThemeStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (themeUtils.isThemePreference(storedTheme)) {
      setTheme(storedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setResolvedTheme(event.matches ? "dark" : "light");
    };

    setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setResolvedTheme, theme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [resolvedTheme, theme]);

  return children;
}
