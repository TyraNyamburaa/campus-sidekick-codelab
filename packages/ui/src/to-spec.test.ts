import { describe, expect, it } from "vitest";
import { campusCatalog } from "./catalog.js";
import { planToSpec } from "./to-spec.js";
import { samplePlan } from "./sample-plan.js";

describe("planToSpec exercise", () => {
  it("creates one timeline element for every scheduled item", () => {
    const spec = planToSpec(samplePlan);
    const timelineItems = Object.keys(spec.elements).filter((key) => /^timeline-\d+$/.test(key));
    expect(timelineItems).toHaveLength(samplePlan.schedule.length);
  });

  it("includes a budget meter and one action per follow-up", () => {
    const spec = planToSpec(samplePlan);
    expect(spec.elements["budget-meter"]?.type).toBe("BudgetMeter");
    const actions = Object.keys(spec.elements).filter((key) => key.startsWith("action-"));
    expect(actions).toHaveLength(samplePlan.followUps.length);
  });

  it("still validates against the trusted catalog", () => {
    expect(campusCatalog.validate(planToSpec(samplePlan)).success).toBe(true);
  });
});
