import {
  THEME_STORAGE_KEY,
  useThemeStore,
  type ResolvedTheme,
} from "@/app/store/themeStore";

let themeAnimTimer: number | null = null;

/**
 * Executes a dark/light mode toggle with the circular clip-path wave animation
 * using the View Transitions API (or CSS transition fallback), matching the prototype.
 */
export function toggleThemeWithAnimation(
  ev?: React.MouseEvent | MouseEvent | null,
) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const currentTheme = useThemeStore.getState().resolvedTheme;
  const nextTheme: ResolvedTheme = currentTheme === "dark" ? "light" : "dark";

  const applyDomTheme = (theme: ResolvedTheme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  };

  const commit = () => {
    applyDomTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // ignore
    }
    useThemeStore.getState().setTheme(nextTheme);
  };

  const reduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduced) {
    commit();
    return;
  }

  // Identify target button coordinates for the animation origin
  let node: Element | null =
    ((ev?.currentTarget as Element) || (ev?.target as Element)) ?? null;
  if (node && "closest" in node) {
    node = (node as HTMLElement).closest("button") || node;
  }
  if (!node || !node.getBoundingClientRect) {
    node = document.querySelector(
      "[data-theme-toggle] button, [data-theme-toggle]",
    );
  }

  const rect = node?.getBoundingClientRect?.() ?? null;
  const x =
    rect && rect.width ? rect.left + rect.width / 2 : window.innerWidth - 56;
  const y = rect && rect.height ? rect.top + rect.height / 2 : 40;

  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };

  if (!doc.startViewTransition) {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    commit();
    if (themeAnimTimer) {
      window.clearTimeout(themeAnimTimer);
    }
    themeAnimTimer = window.setTimeout(() => {
      root.classList.remove("theme-anim");
    }, 340);
    return;
  }

  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  try {
    const transition = doc.startViewTransition(() => {
      commit();
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${r}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  } catch {
    commit();
  }
}
