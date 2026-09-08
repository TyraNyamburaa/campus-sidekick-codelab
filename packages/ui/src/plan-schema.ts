import { z } from "zod";

export const planItemSchema = z.object({
  time: z.string().describe("Short display time, for example 2:00 PM"),
  title: z.string().describe("Name of the trusted venue or activity"),
  description: z.string().describe("One concise sentence describing this stop"),
  costKsh: z.number().nonnegative().describe("Cost of this item in Kenyan shillings"),
});

export const campusPlanSchema = z.object({
  responseId: z.string().describe("A short unique identifier for this response"),
  title: z.string().describe("A lively title for the plan"),
  summary: z.string().describe("A short conversational explanation of why this plan fits"),
  tone: z.enum(["focus", "balanced", "social"]),
  budgetKsh: z.number().positive(),
  totalCostKsh: z.number().nonnegative(),
  remainingKsh: z.number().nonnegative(),
  schedule: z.array(planItemSchema).min(1).max(6),
  followUps: z
    .array(
      z.object({
        label: z.string().describe("Short button label"),
        prompt: z.string().describe("Message to send back to the agent when chosen"),
      }),
    )
    .min(1)
    .max(3),
});

export type CampusPlan = z.infer<typeof campusPlanSchema>;
