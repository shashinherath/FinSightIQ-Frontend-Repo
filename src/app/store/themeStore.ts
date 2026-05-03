import { create } from "zustand";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "finsightiq-theme";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: ThemePreference): ResolvedTheme =>
  theme === "system" ? getSystemTheme() : theme;

const getInitialTheme = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(storedTheme) ? storedTheme : "system";
};

const initialTheme = getInitialTheme();

interface ThemeState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: resolveTheme(initialTheme),
  setTheme: (theme) =>
    set({
      theme,
      resolvedTheme: resolveTheme(theme),
    }),
  setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
  toggleTheme: () => {
    const nextTheme = get().resolvedTheme === "dark" ? "light" : "dark";
    set({ theme: nextTheme, resolvedTheme: nextTheme });
  },
}));

export const themeUtils = {
  getSystemTheme,
  resolveTheme,
  isThemePreference,
};
