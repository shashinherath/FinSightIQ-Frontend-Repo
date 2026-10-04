import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useThemeStore } from "@/app/store/themeStore";
import { cn, toggleThemeWithAnimation } from "@/shared/utils";

export interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ThemeToggle({ className, style, onClick }: ThemeToggleProps) {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const ActiveIcon = isDark ? Moon : Sun;

  const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(ev);
    } else {
      toggleThemeWithAnimation(ev);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-theme-toggle="1"
      aria-label="Toggle theme"
      onClick={handleClick}
      style={style}
      className={cn(
        "relative h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150",
        className,
      )}
    >
      <ActiveIcon className="h-5 w-5" />
    </Button>
  );
}
