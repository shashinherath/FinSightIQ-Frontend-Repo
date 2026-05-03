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
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
