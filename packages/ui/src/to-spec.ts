import type { Spec } from "@json-render/core";
import type { CampusPlan } from "./plan-schema.js";

/**
 * Part 2 starts with a valid but plain two-element UI. Students extend this function so the
 * structured plan becomes a timeline, budget meter, and action buttons.
 */
export function planToSpec(plan: CampusPlan): Spec {
  // TODO 7: Add the schedule, budget, and follow-up actions to this declarative spec.
  return {
    root: "plan-card",
    elements: {
      "plan-card": {
        type: "Card",
        props: { title: plan.title, tone: plan.tone },
        children: ["plan-summary"],
      },
      "plan-summary": {
        type: "Text",
        props: { text: plan.summary, muted: false },
        children: [],
      },
    },
  };
}
