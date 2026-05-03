import { Spinner } from "@/shared/components/Spinner";

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = "Loading" }: PageLoaderProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <Spinner size="lg" />
      <span>{label}</span>
    </div>
  );
}
