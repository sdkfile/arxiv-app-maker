"use client";

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Interactive Demo</h1>
      <p className="text-muted-foreground mb-8">
        {"{{APP_DEMO_DESCRIPTION}}"}
      </p>

      {/* TODO: Claude Code fills this with the paper-specific interactive demo */}
      <div className="rounded-xl border-2 border-dashed p-12 text-center text-muted-foreground">
        Demo area — implement paper&apos;s core interaction here
      </div>
    </div>
  );
}
