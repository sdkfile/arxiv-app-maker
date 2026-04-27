export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          📄 Based on arXiv research
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
          {"{{APP_HEADLINE}}"}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          {"{{APP_DESCRIPTION}}"}
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="/demo"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Try Demo
          </a>
          <a
            href="{{PAPER_URL}}"
            className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-accent transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Paper →
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="border-t px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Step 1", desc: "{{FEATURE_1}}" },
              { title: "Step 2", desc: "{{FEATURE_2}}" },
              { title: "Step 3", desc: "{{FEATURE_3}}" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border p-6">
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          Based on{" "}
          <a
            href="{{PAPER_URL}}"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"{{PAPER_TITLE}}"}
          </a>
        </p>
        <p className="mt-1">Built by Nullpointer Studio</p>
      </footer>
    </div>
  );
}
