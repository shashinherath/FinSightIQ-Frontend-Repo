import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/cn";

interface PasswordStrengthProps {
  password: string;
}

const getScore = (password: string) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
};

const strengthMap = [
  { label: "Too weak", className: "text-destructive", bar: "bg-destructive" },
  { label: "Weak", className: "text-destructive", bar: "bg-destructive/80" },
  { label: "Fair", className: "text-amber-500", bar: "bg-amber-500" },
  { label: "Good", className: "text-emerald-500", bar: "bg-emerald-500" },
  { label: "Strong", className: "text-emerald-500", bar: "bg-emerald-500" },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = getScore(password);
  const normalizedScore = Math.min(score, 5);
  const strength = strengthMap[Math.max(normalizedScore - 1, 0)];
  const progress = normalizedScore === 0 ? 5 : (normalizedScore / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Password strength</span>
        <Badge variant="outline" className={cn("text-xs", strength.className)}>
          {password.length === 0 ? "Enter password" : strength.label}
        </Badge>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", strength.bar)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
