import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

export const campusCatalog = defineCatalog(schema, {
  components: {
    Card: {
      props: z.object({
        title: z.string(),
        tone: z.enum(["focus", "balanced", "social"]),
      }),
      slots: ["default"],
      description: "The outer container for one complete campus plan.",
    },
    Stack: {
      props: z.object({ gap: z.enum(["sm", "md", "lg"]) }),
      slots: ["default"],
      description: "Groups related elements vertically with consistent spacing.",
    },
    Heading: {
      props: z.object({ text: z.string(), level: z.enum(["h2", "h3"]) }),
      description: "A section heading. Do not use it for paragraph text.",
    },
    Text: {
      props: z.object({ text: z.string(), muted: z.boolean() }),
      description: "A short paragraph or supporting sentence.",
    },
    TimelineItem: {
      props: z.object({
        time: z.string(),
        title: z.string(),
        description: z.string(),
        costKsh: z.number().min(0),
      }),
      description: "One scheduled stop in the student's plan.",
    },
    BudgetMeter: {
      props: z.object({
spentKsh: z.number().min(0),
budgetKsh: z.number().min(1),
remainingKsh: z.number().min(0),
      }),
      description: "Shows how much of the student's budget the plan uses.",
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary"]),
      }),
      description: "Lets the student ask the agent to refine or choose a plan.",
    },
  },
  actions: {
    choosePlan: {
      params: z.object({ prompt: z.string() }),
      description: "Send the button's follow-up prompt back to Campus Sidekick.",
    },
  },
});
