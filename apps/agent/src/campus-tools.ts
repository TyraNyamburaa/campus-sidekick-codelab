import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  activities,
  foodOptions,
  studySpots,
  type CampusOption,
  type NoiseLevel,
  type TimeOfDay,
} from "./campus-data.js";

/**
 * TODO 1: This helper currently ignores both filters.
 * Make the exercise tests pass without changing the fixture data or test expectations.
 */
export function withinBudgetAndArea<T extends CampusOption>(
  options: T[],
  maxCostKsh: number,
  area?: string,
): T[] {
  void maxCostKsh;
  void area;
  return options;
}

export const findStudySpots = tool(
  ({ area, noiseLevel, maxCostKsh }) => {
    // TODO 2: Use withinBudgetAndArea, then keep only the requested noise level.
    void area;
    void noiseLevel;
    void maxCostKsh;
    return JSON.stringify(studySpots);
  },
  {
    name: "find_study_spots",
    description:
      "Find trusted study spaces from the local campus guide. Use this instead of inventing venues or prices.",
    schema: z.object({
      area: z.string().optional().describe("Preferred Nairobi area"),
      noiseLevel: z.enum(["quiet", "social"]).describe("Preferred study atmosphere"),
      maxCostKsh: z.number().nonnegative().describe("Maximum amount available for the study space"),
    }),
  },
);

export const findActivities = tool(
  ({ area, interests, maxCostKsh, timeOfDay }) => {
    // TODO 3: Filter by budget/area, time of day, and at least one matching interest.
    void area;
    void interests;
    void maxCostKsh;
    void timeOfDay;
    return JSON.stringify(activities);
  },
  {
    name: "find_activities",
    description:
      "Find affordable social or recreational activities from the local campus guide.",
    schema: z.object({
      area: z.string().optional().describe("Preferred Nairobi area"),
      interests: z.array(z.string()).min(1).describe("Activities the student enjoys"),
      maxCostKsh: z.number().nonnegative().describe("Maximum amount available for the activity"),
      timeOfDay: z.enum(["morning", "afternoon", "evening"]),
    }),
  },
);

export const findFoodOptions = tool(
  ({ area, maxCostKsh, dietaryPreference }) => {
    // TODO 4: Filter by budget/area and dietary preference when one is supplied.
    void area;
    void maxCostKsh;
    void dietaryPreference;
    return JSON.stringify(foodOptions);
  },
  {
    name: "find_food_options",
    description: "Find student-friendly food options with known local prices.",
    schema: z.object({
      area: z.string().optional().describe("Preferred Nairobi area"),
      maxCostKsh: z.number().nonnegative().describe("Maximum amount available for food"),
      dietaryPreference: z.string().optional().describe("For example vegetarian or vegan"),
    }),
  },
);

export const campusTools = [findStudySpots, findActivities, findFoodOptions];

// Exporting these keeps the exercise vocabulary visible in editor tooltips.
export type CampusToolPreferences = {
  noiseLevel: NoiseLevel;
  timeOfDay: TimeOfDay;
};
