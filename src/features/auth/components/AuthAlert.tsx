import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface AuthAlertProps {
  message: string;
  className?: string;
}

export function AuthAlert({ message, className }: AuthAlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
