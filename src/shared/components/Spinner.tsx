import { LoaderCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

interface SpinnerProps {
  size?: keyof typeof sizeMap;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <LoaderCircle
      className={cn(
        "animate-spin text-muted-foreground",
        sizeMap[size],
        className,
      )}
    />
  );
}
