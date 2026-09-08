export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fde68a_0,transparent_28%),radial-gradient(circle_at_bottom_right,#99f6e4_0,transparent_30%)]" />
      <section className="relative w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Campus Sidekick
          </span>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
            Codelab · Part 1
          </span>
        </div>

        <p className="mb-3 font-mono text-sm uppercase tracking-[0.22em] text-teal-700">
          Today: build the brain
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Turn a student&apos;s free afternoon into a plan that actually fits.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Your LangGraph agent will combine trusted study spots, food, and activities without
          breaking the student&apos;s time or KSh budget.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Model", "Gemini understands the request."],
            ["02", "Tools", "Typed functions provide trusted facts."],
            ["03", "Graph", "Edges decide what happens next."],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span className="font-mono text-sm text-teal-700">{number}</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">The agent UI arrives in Part 2.</p>
            <p className="mt-1 text-sm text-slate-300">
              For now, build and inspect the graph in Skein Console.
            </p>
          </div>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-300 px-5 font-bold text-slate-950 transition hover:bg-amber-200"
            href="http://localhost:2024/console"
          >
            Open Skein Console
          </a>
        </div>
      </section>
    </main>
  );
}
