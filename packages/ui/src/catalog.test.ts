import { describe, expect, it } from "vitest";
import { campusCatalog } from "./catalog.js";
import { planToSpec } from "./to-spec.js";
import { samplePlan } from "./sample-plan.js";

describe("Campus Sidekick catalog", () => {
  it("accepts the starter spec", () => {
    expect(campusCatalog.validate(planToSpec(samplePlan)).success).toBe(true);
  });

  it("rejects components outside the allowlist", () => {
    const result = campusCatalog.validate({
      root: "unsafe",
      elements: {
        unsafe: { type: "ArbitraryScript", props: {}, children: [] },
      },
    });
    expect(result.success).toBe(false);
  });
});
