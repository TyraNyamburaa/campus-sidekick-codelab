export type NoiseLevel = "quiet" | "social";
export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface CampusOption {
  id: string;
  name: string;
  area: string;
  costKsh: number;
  description: string;
}

export interface StudySpot extends CampusOption {
  noiseLevel: NoiseLevel;
  hasWifi: boolean;
}

export interface Activity extends CampusOption {
  interests: string[];
  timeOfDay: TimeOfDay[];
  durationMinutes: number;
}

export interface FoodOption extends CampusOption {
  dietaryOptions: string[];
}

// This is intentionally small, local fixture data. The agent must reason over facts we control
// instead of inventing prices or depending on another API during class.
export const studySpots: StudySpot[] = [
  {
    id: "spot-1",
    name: "Campus Learning Commons",
    area: "Karen",
    costKsh: 0,
    description: "A quiet shared study room with charging points.",
    noiseLevel: "quiet",
    hasWifi: true,
  },
  {
    id: "spot-2",
    name: "Community Library",
    area: "Ngong Road",
    costKsh: 100,
    description: "Individual desks, reference books, and a calm reading room.",
    noiseLevel: "quiet",
    hasWifi: true,
  },
  {
    id: "spot-3",
    name: "Garden Study Tables",
    area: "Karen",
    costKsh: 0,
    description: "Outdoor tables for group revision and pair programming.",
    noiseLevel: "social",
    hasWifi: false,
  },
];

export const activities: Activity[] = [
  {
    id: "activity-1",
    name: "Karura Nature Walk",
    area: "Karura",
    costKsh: 150,
    description: "A relaxed walk with friends on a marked forest trail.",
    interests: ["nature", "fitness", "friends"],
    timeOfDay: ["morning", "afternoon"],
    durationMinutes: 90,
  },
  {
    id: "activity-2",
    name: "Board Game Meetup",
    area: "Karen",
    costKsh: 200,
    description: "Casual team games hosted in the student common room.",
    interests: ["games", "friends", "indoor"],
    timeOfDay: ["afternoon", "evening"],
    durationMinutes: 120,
  },
  {
    id: "activity-3",
    name: "Open Mic Evening",
    area: "Kilimani",
    costKsh: 350,
    description: "Poetry, music, and short performances from young creatives.",
    interests: ["music", "art", "friends"],
    timeOfDay: ["evening"],
    durationMinutes: 120,
  },
];

export const foodOptions: FoodOption[] = [
  {
    id: "food-1",
    name: "Campus Canteen Bowl",
    area: "Karen",
    costKsh: 180,
    description: "Rice, vegetables, and a choice of beans or chicken.",
    dietaryOptions: ["vegetarian", "halal-friendly"],
  },
  {
    id: "food-2",
    name: "Chapati and Beans Stop",
    area: "Ngong Road",
    costKsh: 220,
    description: "A filling student lunch served quickly.",
    dietaryOptions: ["vegetarian"],
  },
  {
    id: "food-3",
    name: "Kilimani Café Combo",
    area: "Kilimani",
    costKsh: 480,
    description: "A sandwich, fruit, and a hot drink.",
    dietaryOptions: ["vegetarian", "vegan"],
  },
];
