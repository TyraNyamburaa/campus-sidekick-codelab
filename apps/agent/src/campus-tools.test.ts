import { describe, expect, it } from "vitest";
import { activities, studySpots } from "./campus-data.js";
import {
  findActivities,
  findFoodOptions,
  findStudySpots,
  withinBudgetAndArea,
} from "./campus-tools.js";

describe("withinBudgetAndArea exercise", () => {
  it("does not return options that exceed the student's budget", () => {
    const results = withinBudgetAndArea(activities, 200);
    expect(results.every((item) => item.costKsh <= 200)).toBe(true);
    expect(results.map((item) => item.id)).toEqual(["activity-1", "activity-2"]);
  });

  it("matches areas without being sensitive to letter case", () => {
    const results = withinBudgetAndArea(studySpots, 500, "KAREN");
    expect(results.map((item) => item.id)).toEqual(["spot-1", "spot-3"]);
  });

  it("does not mutate the original fixture array", () => {
    const original = [...activities];
    withinBudgetAndArea(activities, 100);
    expect(activities).toEqual(original);
  });
});

describe("Campus Sidekick tool exercises", () => {
  it("finds only quiet, affordable study spots in the requested area", async () => {
    const value = await findStudySpots.invoke({
      area: "Karen",
      noiseLevel: "quiet",
      maxCostKsh: 50,
    });
    const results = JSON.parse(value) as { id: string }[];
    expect(results.map((item) => item.id)).toEqual(["spot-1"]);
  });

  it("matches activities by time and at least one interest", async () => {
    const value = await findActivities.invoke({
      interests: ["games"],
      maxCostKsh: 250,
      timeOfDay: "afternoon",
    });
    const results = JSON.parse(value) as { id: string }[];
    expect(results.map((item) => item.id)).toEqual(["activity-2"]);
  });

  it("honours an optional dietary preference", async () => {
    const value = await findFoodOptions.invoke({
      maxCostKsh: 500,
      dietaryPreference: "vegan",
    });
    const results = JSON.parse(value) as { id: string }[];
    expect(results.map((item) => item.id)).toEqual(["food-3"]);
  });
});
