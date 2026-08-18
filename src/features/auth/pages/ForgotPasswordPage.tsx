import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AuthCard } from "@/features/auth/components/AuthCard";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async () => {
    await Promise.resolve();
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        description="If an account exists for that address, a reset link is on its way."
      >
        <div className="flex items-start gap-2.5 rounded-lg border border-dashed bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <Mail className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            The response is the same whether or not the address is registered.
            This prevents the form being used to discover accounts.
          </span>
        </div>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter the email on your account and a reset link is sent to it."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="analyst@firm.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email?.message)}
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The link expires after 30 minutes. Requesting a new one invalidates
          the previous link.
        </p>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
