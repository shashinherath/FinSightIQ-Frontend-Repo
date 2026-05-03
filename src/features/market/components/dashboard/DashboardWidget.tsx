/**
 * Dashboard Widget Components
 */

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, X, Settings, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

export interface DashboardWidgetProps {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  removable?: boolean;
  configurable?: boolean;
  onRemove?: () => void;
  onConfigure?: () => void;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

export function DashboardWidget({
  title,
  description,
  children,
  collapsible = true,
  removable = false,
  configurable = false,
  onRemove,
  onConfigure,
  className,
  loading = false,
  error = null,
}: DashboardWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden",
        "transition-all duration-200 hover:border-slate-600",
        isExpanded && "fixed inset-0 z-50 m-4 rounded-xl",
        className,
      )}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100">{title}</h3>
          {description && (
            <p className="text-xs text-slate-400">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {configurable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onConfigure}
              className="text-slate-400 hover:text-slate-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-slate-200"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isCollapsed && "-rotate-90",
                )}
              />
            </Button>
          )}

          {removable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-slate-400 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      {!isCollapsed && (
        <div
          className={cn(
            "p-4",
            isExpanded && "h-[calc(100vh-120px)] overflow-y-auto",
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                <p className="mt-4 text-slate-400">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}

export interface WidgetSkeletonProps {
  lines?: number;
  className?: string;
}

export function WidgetSkeleton({ lines = 3, className }: WidgetSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-700 rounded animate-pulse" />
      ))}
    </div>
  );
}
