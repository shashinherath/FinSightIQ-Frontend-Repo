# FinSightIQ Frontend

AI stock prediction platform frontend built with **React 19 + TypeScript + Vite**.

## Tech Stack

- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: Zustand / Redux Toolkit
- **Data**: TanStack Query + Axios
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts / ApexCharts
- **Realtime**: SignalR
- **Testing**: Vitest + React Testing Library, Playwright
- **Lint/Format**: ESLint + Prettier

## Getting Started

```bash
pnpm install
pnpm dev
```

Build and preview:

```bash
pnpm build
pnpm preview
```

## Project Structure (Feature-Based)

```text
src/
  app/
  features/
    auth/
    dashboard/
    portfolio/
    predictions/
    settings/
  shared/
    components/
    hooks/
    layouts/
    services/
    styles/
    ui/            # shadcn/ui components
    utils/
  styles/
  tests/
  e2e/
```

## UI Components (shadcn/ui)

Use the shadcn/ui generator to add components into `src/shared/ui`.

```bash
pnpm dlx shadcn@latest add button
```

## Code Quality

- **Lint**: `pnpm lint`
- **Format**: `pnpm format`
- **Tests**: `pnpm test` and `pnpm test:ui`
- **E2E**: `pnpm e2e`

## Docs

See `docs/FinSightIQ_Frontend_Guidelines.md` for architecture, conventions, and UI rules.
