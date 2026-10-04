"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OcState } from "./state";
import { ConductorDancers, TwoWays, TradeOffs, Engines, WhichApproach, Wrap } from "./steps";

export default defineModule<OcState>({
  initialState,
  steps: [
    { id: "story", title: "Conductor or dancers?", Component: ConductorDancers },
    { id: "loan", title: "A loan, two ways", Component: TwoWays },
    { id: "tradeoffs", title: "Trade-offs", Component: TradeOffs },
    { id: "engines", title: "Workflow engines", Component: Engines },
    {
      id: "check",
      title: "Which approach?",
      checkpoint: "which-approach",
      Component: WhichApproach,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
