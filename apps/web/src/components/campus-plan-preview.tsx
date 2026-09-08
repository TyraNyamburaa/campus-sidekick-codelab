"use client";

import { planToSpec, samplePlan } from "@campus-sidekick/ui";
import { CampusPlanRenderer } from "./campus-plan-renderer";

export function CampusPlanPreview() {
  const spec = planToSpec(samplePlan);

  return (
    <CampusPlanRenderer
      spec={spec}
      onAction={(name, params) => {
        // In the first UI checkpoint, actions are visible in the console. Later they go to Skein.
        console.info("json-render action", name, params);
      }}
    />
  );
}
