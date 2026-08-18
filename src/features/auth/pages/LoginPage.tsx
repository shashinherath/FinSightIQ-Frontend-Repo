import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthAlert } from "@/features/auth/components/AuthAlert";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/validation/authSchemas";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/shared/utils/cn";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, status, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const isLoading = isSubmitting || status === "loading";

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    await login(values);
    navigate("/app/dashboard", { replace: true });
  };

  return (
    <AuthCard
      title="Sign in"
      description="Sign in to access your real-time portfolio."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link to="/register" className="font-medium text-primary">
            Create one
          </Link>
        </p>
      }
    >
      {error && <AuthAlert message={error} />}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="analyst@firm.com"
            autoComplete="email"
            className={cn(errors.email && "border-destructive")}
            aria-invalid={Boolean(errors.email?.message)}
            aria-describedby={errors.email?.message ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email?.message && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            hasError={Boolean(errors.password?.message)}
            aria-invalid={Boolean(errors.password?.message)}
            aria-describedby={
              errors.password?.message ? "password-error" : undefined
            }
            {...register("password")}
          />
          {errors.password?.message && (
            <p id="password-error" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Keep me signed in on this device
            </label>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
