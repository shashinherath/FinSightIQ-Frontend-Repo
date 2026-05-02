# FinSightIQ Frontend Development Guidelines

**Project:** FinSightIQ — AI Stock Prediction Platform  
**Frontend Stack:** React 19 + TypeScript + Vite  
**Architecture Style:** Scalable Feature-Based Frontend Architecture  
**Version:** 1.0  
**Last Updated:** May 2026

---

# 1. Introduction

This document defines the official frontend engineering standards, architecture patterns, coding conventions, security requirements, testing practices, and UI/UX guidelines for the FinSightIQ frontend application.

The frontend is a critical production-grade system responsible for:

- Real-time financial visualization
- AI prediction rendering
- Portfolio analytics
- Authentication workflows
- WebSocket-driven live updates
- Performance-sensitive chart rendering
- Responsive enterprise dashboards

The frontend must be:

- Scalable
- Maintainable
- Secure
- Accessible
- Performant
- Production-ready

These guidelines ensure consistency across all frontend modules and contributors.

---

# 2. Frontend Technology Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Framework        | React 19                       |
| Language         | TypeScript                     |
| Build Tool       | Vite                           |
| Routing          | React Router v6                |
| State Management | Zustand / Redux Toolkit        |
| Data Fetching    | React Query (TanStack Query)   |
| HTTP Client      | Axios                          |
| Styling          | Tailwind CSS                   |
| UI Components    | shadcn/ui                      |
| Charts           | Recharts / ApexCharts          |
| Forms            | React Hook Form                |
| Validation       | Zod                            |
| Realtime         | SignalR                        |
| Authentication   | JWT + Refresh Tokens           |
| Testing          | Vitest + React Testing Library |
| E2E Testing      | Playwright                     |
| Linting          | ESLint                         |
| Formatting       | Prettier                       |
| Git Hooks        | Husky + lint-staged            |
| Error Monitoring | Sentry                         |
| Analytics        | PostHog / Azure App Insights   |

---

# 3. Frontend Architecture Principles

The frontend must follow:

- Feature-based architecture
- Separation of concerns
- Component reusability
- Predictable state management
- Domain-driven folder structure
- API abstraction
- Strong typing
- Lazy loading
- Modular scalability

---

# 4. Recommended Frontend Folder Structure

```txt
frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   ├── layouts/
│   │   ├── store/
│   │   └── config/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── market/
│   │   ├── predictions/
│   │   ├── portfolio/
│   │   ├── sentiment/
│   │   ├── alerts/
│   │   └── settings/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── types/
│   │   ├── validation/
│   │   └── ui/
│   │
│   ├── styles/
│   ├── assets/
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
├── e2e/
├── .env
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

# 5. Feature-Based Module Structure

Each feature must be isolated.

Example:

```txt
features/predictions/
│
├── api/
├── components/
├── hooks/
├── pages/
├── store/
├── types/
├── validation/
├── utils/
└── index.ts
```

Rules:

- No cross-feature imports
- Shared logic goes to `/shared`
- Features own their internal state
- Features expose only public APIs

---

# 6. Component Design Guidelines

## 6.1 Component Types

### Presentational Components

Responsible only for UI rendering.

```tsx
type PriceBadgeProps = {
  value: number;
};

export function PriceBadge({ value }: PriceBadgeProps) {
  return <span>{value}</span>;
}
```

---

### Container Components

Responsible for:

- API calls
- State management
- Business logic

---

## 6.2 Component Rules

### MUST

- Use functional components only
- Use TypeScript interfaces/types
- Keep components small
- Use memoization where needed
- Use composition over inheritance

### MUST NOT

- Put API calls directly inside UI components
- Use large monolithic components
- Use deeply nested prop drilling
- Use inline business logic

---

## 6.3 shadcn/ui Usage

shadcn/ui is the standard component foundation. Use it for core UI primitives and compose on top of it.

### MUST

- Prefer shadcn/ui components for buttons, inputs, dialogs, tables, and forms
- Keep shadcn/ui components in `/src/shared/ui` and wrap them when app-specific behavior is needed
- Align shadcn/ui theming with Tailwind tokens and dark mode strategy

### MUST NOT

- Fork shadcn/ui components without a clear, documented reason
- Duplicate primitives that already exist in shadcn/ui

---

# 7. Naming Conventions

| Item           | Convention         | Example                |
| -------------- | ------------------ | ---------------------- |
| Components     | PascalCase         | `PredictionCard.tsx`   |
| Hooks          | camelCase with use | `usePredictionData.ts` |
| Types          | PascalCase         | `PredictionResponse`   |
| Constants      | UPPER_SNAKE_CASE   | `MAX_RETRY_COUNT`      |
| CSS Classes    | Tailwind utilities | `flex items-center`    |
| Folders        | kebab-case         | `market-data`          |
| Zustand Stores | camelCaseStore     | `authStore.ts`         |

---

# 8. TypeScript Standards

## MUST

- Enable strict mode
- Avoid `any`
- Use explicit return types
- Prefer interfaces for objects
- Use union types where appropriate

Example:

```ts
export interface PredictionResponse {
  symbol: string;
  predictedPrice: number;
  confidence: number;
}
```

---

# 9. State Management Guidelines

## Global State

Use Zustand or Redux Toolkit only for:

- Authentication
- Theme
- User preferences
- Global app settings

---

## Server State

Use React Query for:

- API data
- Caching
- Polling
- Mutations
- Retry handling

Example:

```ts
useQuery({
  queryKey: ["predictions", symbol],
  queryFn: () => fetchPredictions(symbol),
});
```

---

## Local State

Use `useState` for:

- Form inputs
- UI toggles
- Modal states

---

# 10. API Layer Standards

All HTTP requests must go through centralized services.

Example:

```ts
// shared/services/httpClient.ts

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

---

## API Rules

### MUST

- Use interceptors
- Handle token refresh centrally
- Handle errors consistently
- Use typed responses
- Use request cancellation

### MUST NOT

- Call APIs directly inside JSX
- Duplicate endpoints
- Hardcode URLs

---

# 11. Authentication Standards

FinSightIQ uses JWT authentication with refresh token rotation.

---

## Frontend Requirements

### Access Token

- Store in memory only
- Never store in localStorage

### Refresh Token

- Store in HttpOnly secure cookies

### Auto Refresh

- Axios interceptor handles refresh automatically

### Logout

Must:

- Clear state
- Clear caches
- Invalidate sessions
- Redirect to login

---

# 12. Route Protection

Use protected route wrappers.

Example:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

# 13. Error Handling Standards

## API Errors

Centralize handling:

```ts
try {
  await apiCall();
} catch (error) {
  handleApiError(error);
}
```

---

## UI Error Boundaries

All major layouts must use React Error Boundaries.

---

## User-Friendly Errors

Never expose:

- Stack traces
- SQL errors
- Internal exception details

---

# 14. Real-Time Data Guidelines

FinSightIQ uses SignalR/WebSockets for live market updates.

---

## Rules

### MUST

- Reconnect automatically
- Use exponential backoff
- Cleanup subscriptions
- Subscribe only to required symbols

### MUST NOT

- Open multiple duplicate connections
- Broadcast unnecessary updates

---

# 15. Financial Charting Standards

Charts are core business functionality.

---

## Recommended Libraries

- ApexCharts
- Recharts

---

## Chart Rules

### MUST

- Support responsive layouts
- Support dark mode
- Render confidence bands
- Handle large datasets efficiently
- Use memoization

### MUST NOT

- Re-render entire charts unnecessarily
- Fetch chart data repeatedly
- Block UI thread

---

# 16. Performance Guidelines

## Required Optimizations

### Lazy Loading

```tsx
const DashboardPage = lazy(() => import("./DashboardPage"));
```

---

### Code Splitting

Split by:

- Routes
- Feature modules
- Heavy charts

---

### Memoization

Use:

- `React.memo`
- `useMemo`
- `useCallback`

When performance-critical.

---

### Virtualization

Required for:

- Large tables
- Large watchlists
- Historical trade lists

Use:

- `react-window`
- `react-virtualized`

---

# 17. Security Guidelines

Frontend security must align with OWASP standards.

---

## MUST

- Escape user content
- Use CSP headers
- Validate all form inputs
- Sanitize URLs
- Use HTTPS only
- Use secure cookies
- Prevent XSS

---

## MUST NOT

- Store secrets in frontend
- Expose API keys
- Trust frontend validation only
- Use `dangerouslySetInnerHTML`

---

# 18. Form Handling Standards

Use:

- React Hook Form
- Zod validation

Example:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

# 19. UI/UX Standards

FinSightIQ is an enterprise-grade financial analytics platform.

The UI must feel:

- Professional
- Fast
- Modern
- Data-centric
- Minimal
- Information-dense

---

## Design Rules

### MUST

- Support dark mode
- Maintain spacing consistency
- Use skeleton loaders
- Use optimistic updates carefully
- Maintain accessibility contrast ratios

### MUST NOT

- Use flashy animations excessively
- Overload dashboards
- Hide critical data

---

# 20. Accessibility Standards

WCAG 2.1 AA compliance is required.

---

## Accessibility Requirements

### MUST

- Support keyboard navigation
- Use semantic HTML
- Use aria-labels
- Support screen readers
- Maintain focus states

### MUST NOT

- Use inaccessible color combinations
- Remove focus outlines blindly

---

# 21. Responsive Design Guidelines

Support:

- Desktop
- Tablet
- Mobile

---

## Breakpoint Strategy

| Device  | Width            |
| ------- | ---------------- |
| Mobile  | `< 768px`        |
| Tablet  | `768px - 1024px` |
| Desktop | `> 1024px`       |

---

# 22. Loading State Standards

Every async operation must provide:

- Skeleton loaders
- Retry states
- Empty states
- Error states

---

# 23. Logging & Monitoring

## Frontend Monitoring

Use:

- Sentry
- Azure App Insights

Track:

- Crashes
- API failures
- Slow renders
- Route transitions

---

# 24. Testing Standards

## Unit Testing

Tools:

- Vitest
- React Testing Library

Coverage target:

```txt
Minimum 80%
```

---

## E2E Testing

Use Playwright.

Critical flows:

- Login
- Predictions
- Portfolio management
- Real-time updates
- Alerts
- Token refresh

---

# 25. Git & Pull Request Standards

## Branch Naming

```txt
feature/prediction-chart
bugfix/auth-refresh
hotfix/token-expiry
```

---

## Commit Convention

```txt
feat:
fix:
refactor:
test:
docs:
style:
```

Example:

```txt
feat(predictions): add SHAP visualization chart
```

---

# 26. Environment Variable Standards

Only expose frontend-safe variables.

Example:

```env
VITE_API_URL=
VITE_SIGNALR_URL=
VITE_APP_ENV=
```

---

## MUST NOT

- Store secrets
- Store connection strings
- Store private keys

---

# 27. Dark Mode Standards

Dark mode is mandatory.

Use Tailwind dark mode strategy:

```ts
darkMode: "class";
```

Persist preference via:

- User settings
- localStorage fallback

---

# 28. Dashboard Engineering Standards

Dashboard pages must:

- Render under 2 seconds
- Avoid blocking requests
- Stream live data progressively
- Minimize unnecessary polling

---

# 29. Financial Data Standards

Financial values must:

- Use proper decimal formatting
- Handle timezone conversions
- Display currency consistently
- Prevent floating-point precision issues

---

# 30. WebSocket UI Standards

When live updates occur:

### MUST

- Highlight changes subtly
- Avoid flashing UI
- Debounce updates where needed

---

# 31. Build & CI Standards

Frontend CI must include:

- Type checking
- ESLint
- Unit tests
- Build verification
- Security audit

---

# 32. Recommended Frontend Libraries

| Purpose       | Library         |
| ------------- | --------------- |
| Charts        | ApexCharts      |
| Tables        | TanStack Table  |
| UI Components | shadcn/ui       |
| Icons         | Lucide React    |
| Date Handling | date-fns        |
| Forms         | React Hook Form |
| Validation    | Zod             |
| Animations    | Framer Motion   |

---

# 33. Frontend Performance Budgets

| Metric              | Target   |
| ------------------- | -------- |
| First Load JS       | < 300 KB |
| Dashboard Render    | < 2 sec  |
| Live Price Update   | < 1 sec  |
| Lighthouse Score    | > 90     |
| Accessibility Score | > 95     |

---

# 34. Production Readiness Checklist

Before production deployment:

- All tests pass
- No TypeScript errors
- No ESLint warnings
- Bundle analyzed
- Accessibility verified
- Security scan passed
- Performance tested
- Dark mode verified
- Mobile responsiveness verified
- Error boundaries tested

---

# 35. Anti-Patterns to Avoid

## NEVER

- Massive components
- Global mutable state
- Unhandled promises
- Inline API calls
- Business logic in JSX
- Deep prop drilling
- Duplicated state
- Unoptimized chart rendering
- Storing tokens insecurely

---

# 36. Recommended Frontend Development Workflow

1. Create feature branch
2. Define feature types
3. Build API layer
4. Build reusable hooks
5. Build UI components
6. Add validation
7. Add loading/error states
8. Write tests
9. Run lint + type checks
10. Create PR

---

# 37. Conclusion

These frontend engineering standards ensure that FinSightIQ remains:

- Scalable
- Enterprise-grade
- Secure
- Maintainable
- High-performance
- Production-ready

The frontend is not merely a visualization layer — it is a mission-critical financial analytics interface requiring strong engineering discipline, consistency, and long-term maintainability aligned with the broader microservices and AI platform architecture.
