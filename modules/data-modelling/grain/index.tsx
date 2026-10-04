"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GrainState } from "./state";
import { Recipe, FourSteps, Mixing, Atomic, WhichStep, Wrap } from "./steps";

export default defineModule<GrainState>({
  initialState,
  steps: [
    { id: "story", title: "Decide what one row means", Component: Recipe },
    { id: "design", title: "Design a supermarket fact table", Component: FourSteps },
    { id: "mixing", title: "Never mix grains", Component: Mixing },
    { id: "atomic", title: "Start atomic", Component: Atomic },
    { id: "check", title: "Which step?", checkpoint: "which-step", Component: WhichStep },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
