import { Suspense, type ComponentType, type ReactNode } from "react";
import { PageLoader } from "@/shared/components/PageLoader";

export function withSuspense<T extends object>(
  Component: ComponentType<T>,
  fallback?: ReactNode,
) {
  const Wrapped = (props: T) => (
    <Suspense fallback={fallback ?? <PageLoader label="Loading page" />}>
      <Component {...(props as T)} />
    </Suspense>
  );

  Wrapped.displayName = `withSuspense(${Component.displayName ?? Component.name ?? "Component"})`;

  return Wrapped;
}
