"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SkewState } from "./state";
import { Checkouts, SkewSim, SpotIt, Fixes, MerchantSkew, Wrap } from "./steps";

export default defineModule<SkewState>({
  initialState,
  steps: [
    { id: "story", title: "The canteen queue", Component: Checkouts },
    { id: "sim", title: "One key, one slow task", Component: SkewSim },
    { id: "spot", title: "Spotting skew", Component: SpotIt },
    { id: "fixes", title: "Fixes, in order", Component: Fixes },
    {
      id: "check",
      title: "The marketplace merchant",
      checkpoint: "merchant-skew",
      Component: MerchantSkew,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
