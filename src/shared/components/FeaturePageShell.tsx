import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface FeaturePageShellProps {
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function FeaturePageShell({
  title,
  description,
  action,
  children,
  className,
}: FeaturePageShellProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
