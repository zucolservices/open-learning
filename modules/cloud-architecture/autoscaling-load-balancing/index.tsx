"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScalingState } from "./state";
import { Counters, HealthChecks, Layers, TuneScaling, WhichBalancer, Wrap } from "./steps";

export default defineModule<ScalingState>({
  initialState,
  steps: [
    { id: "counters", title: "Opening more counters", Component: Counters },
    { id: "tune", title: "Tune the scaling group", Component: TuneScaling },
    { id: "health", title: "When a server gets sick", Component: HealthChecks },
    { id: "layers", title: "Layer 4 or layer 7", Component: Layers },
    {
      id: "which",
      title: "Which load balancer?",
      checkpoint: "lb-layer",
      Component: WhichBalancer,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
