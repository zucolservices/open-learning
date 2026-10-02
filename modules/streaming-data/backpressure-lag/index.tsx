"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LagState } from "./state";
import { Fixes, PullOrPush, SaleDay, ScalingKnobs, WaterTank, Wrap } from "./steps";

export default defineModule<LagState>({
  initialState,
  steps: [
    { id: "tank", title: "A tank between two pipes", Component: WaterTank },
    { id: "sale", title: "Survive the sale", Component: SaleDay },
    { id: "pull", title: "Falling behind, or slowing down", Component: PullOrPush },
    { id: "knobs", title: "Scaling knobs and alarms", Component: ScalingKnobs },
    { id: "fix", title: "What would you do?", checkpoint: "lag-fixes", Component: Fixes },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
