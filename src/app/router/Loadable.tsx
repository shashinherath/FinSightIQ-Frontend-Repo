import { Suspense, type ComponentType, type ReactNode } from "react";
import { PageLoader } from "@/shared/components/PageLoader";

export function withSuspense<T>(
  Component: ComponentType<T>,
  fallback?: ReactNode,
) {
  const Wrapped = (props: T) => (
    <Suspense fallback={fallback ?? <PageLoader label="Loading page" />}>
      <Component {...props} />
    </Suspense>
  );

  Wrapped.displayName = `withSuspense(${Component.displayName ?? Component.name ?? "Component"})`;

  return Wrapped;
}
