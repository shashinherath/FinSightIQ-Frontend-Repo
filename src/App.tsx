function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            FinSightIQ
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Frontend foundation is ready
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Tailwind and shadcn/ui tokens are wired. Build feature modules under
            src/features, and keep shared primitives in src/shared/ui.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {["Auth", "Dashboard", "Market"].map((module) => (
            <div
              key={module}
              className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
            >
              <h2 className="text-lg font-semibold">{module}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add pages, hooks, and API clients to the {module.toLowerCase()}
                feature folder.
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground">
          <h3 className="text-lg font-semibold">Next steps</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Set up the router shell and app layout.</li>
            <li>Configure React Query and API clients.</li>
            <li>Start with the authentication flow.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
