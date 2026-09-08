"use client";

import { campusCatalog } from "@campus-sidekick/ui";
import { createRenderer } from "@json-render/react";

export const CampusPlanRenderer = createRenderer(campusCatalog, {
  Card: ({ element, children }) => {
    const tone = element.props.tone;
    const accent =
      tone === "focus" ? "border-blue-300" : tone === "social" ? "border-pink-300" : "border-teal-300";
    return (
      <section className={`rounded-3xl border-2 ${accent} bg-white p-6 shadow-xl shadow-slate-900/5`}>
        <h2 className="text-2xl font-bold text-slate-950">{element.props.title}</h2>
        <div className="mt-5">{children}</div>
      </section>
    );
  },
  Stack: ({ element, children }) => {
    const gap = element.props.gap === "lg" ? "gap-6" : element.props.gap === "sm" ? "gap-2" : "gap-4";
    return <div className={`flex flex-col ${gap}`}>{children}</div>;
  },
  Heading: ({ element }) => {
    const Tag = element.props.level;
    return <Tag className="text-lg font-bold text-slate-900">{element.props.text}</Tag>;
  },
  Text: ({ element }) => (
    <p className={element.props.muted ? "leading-7 text-slate-500" : "leading-7 text-slate-700"}>
      {element.props.text}
    </p>
  ),
  TimelineItem: ({ element }) => (
    <article className="grid grid-cols-[5.5rem_1fr_auto] gap-3 rounded-2xl bg-slate-50 p-4">
      <time className="font-mono text-sm font-semibold text-teal-700">{element.props.time}</time>
      <div>
        <h3 className="font-bold text-slate-900">{element.props.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{element.props.description}</p>
      </div>
      <span className="font-semibold text-slate-800">KSh {element.props.costKsh}</span>
    </article>
  ),
  BudgetMeter: ({ element }) => {
    // TODO 8: Calculate a capped percentage and render a visual progress bar.
    return (
      <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
        KSh {element.props.spentKsh} spent · KSh {element.props.remainingKsh} remaining from KSh{" "}
        {element.props.budgetKsh}
      </div>
    );
  },
  Button: ({ element, emit }) => (
    <button
      className={
        element.props.variant === "primary"
          ? "rounded-xl bg-slate-950 px-4 py-3 font-bold text-white"
          : "rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-800"
      }
      // TODO 9: Emit the event name used by the spec when the button is pressed.
      onClick={() => void emit}
      type="button"
    >
      {element.props.label}
    </button>
  ),
});
