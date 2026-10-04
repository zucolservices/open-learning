"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AqeState } from "./state";
import { MovingHouse, AqeSim, AdaptivePlan, Knobs, WhichFeature, Wrap } from "./steps";

export default defineModule<AqeState>({
  initialState,
  steps: [
    { id: "story", title: "Booking the vans", Component: MovingHouse },
    { id: "sim", title: "Re-plan with real sizes", Component: AqeSim },
    { id: "plan", title: "Reading an adaptive plan", Component: AdaptivePlan },
    { id: "knobs", title: "The settings that matter", Component: Knobs },
    {
      id: "check",
      title: "Which feature helps?",
      checkpoint: "which-aqe-feature",
      Component: WhichFeature,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
