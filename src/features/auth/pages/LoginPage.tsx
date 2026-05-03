import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
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
      title="Welcome back"
      description="Sign in to access your real-time portfolio and AI insights."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New to FinSightIQ?{" "}
          <Link to="/register" className="font-medium text-primary">
            Create an account
          </Link>
        </p>
      }
    >
      {error && <AuthAlert message={error} />}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
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
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                Remember me
              </label>
            )}
          />
          <Button
            type="button"
            variant="link"
            className="px-0 text-sm"
            onClick={() =>
              toast("Password recovery", {
                description: "Reset flows will be available in the next phase.",
              })
            }
          >
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
