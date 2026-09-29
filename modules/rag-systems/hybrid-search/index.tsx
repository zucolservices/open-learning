"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HybridState } from "./state";
import { FusionLab, RrfCheck, Scoreboard, TwoSearchers, Vendors, Wrap } from "./steps";

export default defineModule<HybridState>({
  initialState,
  steps: [
    { id: "searchers", title: "Two search parties", Component: TwoSearchers },
    { id: "lab", title: "The fusion lab", Component: FusionLab },
    { id: "scores", title: "Scoreboard", Component: Scoreboard },
    { id: "rrf", title: "Do the maths", checkpoint: "rrf-check", Component: RrfCheck },
    { id: "vendors", title: "Hybrid everywhere", Component: Vendors },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
