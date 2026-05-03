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
import { PasswordStrength } from "@/features/auth/components/PasswordStrength";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/validation/authSchemas";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/shared/utils/cn";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, status, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const isLoading = isSubmitting || status === "loading";
  const passwordValue = watch("password");

  const onSubmit = async (values: RegisterFormValues) => {
    clearError();
    await registerUser(values);
    navigate("/app/dashboard", { replace: true });
  };

  return (
    <AuthCard
      title="Create your account"
      description="Start tracking market opportunities with AI-driven insights."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      }
    >
      {error && <AuthAlert message={error} />}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Alex Morgan"
            autoComplete="name"
            className={cn(errors.fullName && "border-destructive")}
            aria-invalid={Boolean(errors.fullName?.message)}
            aria-describedby={
              errors.fullName?.message ? "fullName-error" : undefined
            }
            {...register("fullName")}
          />
          {errors.fullName?.message && (
            <p id="fullName-error" className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
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
            placeholder="Create a strong password"
            autoComplete="new-password"
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
          <PasswordStrength password={passwordValue ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            hasError={Boolean(errors.confirmPassword?.message)}
            aria-invalid={Boolean(errors.confirmPassword?.message)}
            aria-describedby={
              errors.confirmPassword?.message
                ? "confirmPassword-error"
                : undefined
            }
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p id="confirmPassword-error" className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-primary">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms?.message && (
                <p className="text-xs text-destructive">
                  {errors.terms.message}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
