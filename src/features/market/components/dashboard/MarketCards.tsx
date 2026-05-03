/**
 * Market Summary Card Component
 */

import { TrendingUp, TrendingDown } from "lucide-react";
import type { MarketIndex } from "@/features/market/types";
import { cn } from "@/shared/utils/cn";

export interface MarketSummaryCardProps {
  index: MarketIndex;
  onClick?: () => void;
}

export function MarketSummaryCard({ index, onClick }: MarketSummaryCardProps) {
  const isPositive = index.change >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border border-slate-700 bg-slate-800/50",
        "hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-400">{index.name}</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">
            {index.value.toFixed(0)}
          </p>
        </div>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-green-400" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-400" />
        )}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-sm font-semibold",
            isPositive ? "text-green-400" : "text-red-400",
          )}
        >
          {isPositive ? "+" : ""}
          {index.change.toFixed(2)}
        </span>
        <span
          className={cn(
            "text-sm font-semibold",
            isPositive ? "text-green-400" : "text-red-400",
          )}
        >
          {isPositive ? "+" : ""}
          {index.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// TOP MOVERS ITEM
// ============================================================================

export interface TopMoverItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  onClick?: () => void;
}

export function TopMoverItem({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  onClick,
}: TopMoverItemProps) {
  const isPositive = change >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border border-slate-700 bg-slate-800/30",
        "hover:bg-slate-700/50 transition-all duration-200 cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-slate-100">{symbol}</p>
          <p className="text-xs text-slate-400">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-100">${price.toFixed(2)}</p>
          <p
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-green-400" : "text-red-400",
            )}
          >
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {volume && (
        <p className="text-xs text-slate-400">
          Vol: {(volume / 1_000_000).toFixed(1)}M
        </p>
      )}
    </div>
  );
}

// ============================================================================
// MARKET STATISTICS PANEL
// ============================================================================

export interface MarketStatisticsPanelProps {
  stats: Record<string, number | string | undefined>;
}

export function MarketStatisticsPanel({ stats }: MarketStatisticsPanelProps) {
  const entries = Object.entries(stats).filter(
    ([, value]) => value !== undefined && value !== null,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map(([label, value]) => (
        <div
          key={label}
          className="p-3 rounded-lg bg-slate-700/30 border border-slate-700"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="font-semibold text-slate-100 text-lg">
            {typeof value === "number" ? value.toFixed(2) : value}
          </p>
        </div>
      ))}
    </div>
  );
}
