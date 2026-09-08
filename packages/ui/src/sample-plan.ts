import type { CampusPlan } from "./plan-schema.js";

export const samplePlan: CampusPlan = {
  responseId: "sample-balanced-saturday",
  title: "A focused Saturday with room for fun",
  summary: "Study first, recharge with friends, and finish with an affordable meal.",
  tone: "balanced",
  budgetKsh: 800,
  totalCostKsh: 380,
  remainingKsh: 420,
  schedule: [
    {
      time: "1:00 PM",
      title: "Campus Learning Commons",
      description: "Two quiet hours with Wi-Fi and charging points.",
      costKsh: 0,
    },
    {
      time: "3:30 PM",
      title: "Board Game Meetup",
      description: "Relax and play team games with friends.",
      costKsh: 200,
    },
    {
      time: "5:45 PM",
      title: "Campus Canteen Bowl",
      description: "Finish with a filling meal before 7 pm.",
      costKsh: 180,
    },
  ],
  followUps: [
    { label: "Make it cheaper", prompt: "Make this plan cheaper but keep two hours of study." },
    { label: "More social", prompt: "Give me a more social version within the same budget." },
  ],
};
