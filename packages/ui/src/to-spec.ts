import type { Spec } from "@json-render/core";
import type { CampusPlan } from "./plan-schema";

export function planToSpec(plan: any): Spec {
  const timelineIds = plan.schedule.map((_: any, index: number) => `timeline-${index}`);
  const actionsIds = plan.followUps.map((_: any, index: number) => `action-${index}`);

  const elements: Record<string, any> = {
    "plan-card": {
      type: "Card",
      props: { title: plan.title, tone: plan.tone },
      children: [
        "plan-summary",
        "timeline-heading",
        "timeline-stack",
        "budget-heading",
        "budget-meter",
        "actions-heading",
        "actions-stack",
      ],
    },
    "plan-summary": {
      type: "Text",
      props: { text: plan.summary, muted: false },
      children: [],
    },
    "timeline-heading": {
      type: "Heading",
      props: { text: "Your Schedule", level: "h2" },
      children: [],
    },
    "timeline-stack": {
      type: "Stack",
      props: { gap: "md" },
      children: timelineIds,
    },
    "budget-heading": {
      type: "Heading",
      props: { text: "Budget Breakdown", level: "h2" },
      children: [],
    },
    "budget-meter": {
      type: "BudgetMeter",
      props: {
        spentKsh: plan.totalCostKsh,
        budgetKsh: plan.budgetKsh,
        remainingKsh: plan.remainingKsh,
      },
      children: [],
    },
    "actions-heading": {
      type: "Heading",
      props: { text: "Next Steps", level: "h2" },
      children: [],
    },
    "actions-stack": {
      type: "Stack",
      props: { gap: "sm" },
      children: actionsIds,
    },
  };

  plan.schedule.forEach((item: any, index: number) => {
    elements[`timeline-${index}`] = {
      type: "TimelineItem",
      props: {
        time: item.time,
        title: item.title,
        description: item.description,
        costKsh: item.costKsh,
      },
      children: [],
    };
  });

  plan.followUps.forEach((followUp: any, index: number) => {
    elements[`action-${index}`] = {
      type: "Button",
      props: { label: followUp.label, variant: "primary" },
      on: {
        press: { action: "choosePlan", params: { prompt: followUp.prompt } },
      },
      children: [],
    };
  });

  return {
    root: "plan-card",
    elements,
  };
}
