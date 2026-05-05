import { cn } from "@/shared/utils/cn";

export function PipChangeIndicator({ pipChange }: { pipChange: number }) {
  const positive = pipChange >= 0;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        positive
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-rose-500/10 text-rose-400",
      )}
    >
      {positive ? "+" : ""}
      {pipChange.toFixed(1)} pips
    </div>
  );
}
