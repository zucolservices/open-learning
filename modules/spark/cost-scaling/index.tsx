"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CostState } from "./state";
import { Restaurant, CostSim, Shapes, Spot, IdleCluster, Wrap } from "./steps";

export default defineModule<CostState>({
  initialState,
  steps: [
    { id: "story", title: "Staffing the dinner rush", Component: Restaurant },
    { id: "sim", title: "Size a nightly job", Component: CostSim },
    { id: "shapes", title: "Shaping executors", Component: Shapes },
    { id: "spot", title: "Cheaper, interruptible capacity", Component: Spot },
    {
      id: "check",
      title: "The idle cluster",
      checkpoint: "idle-cluster-cost",
      Component: IdleCluster,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
