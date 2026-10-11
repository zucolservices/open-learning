"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MwState } from "./state";
import { Airport, Pipeline, Onion, Common, MwCheck, Wrap } from "./steps";

export default defineModule<MwState>({
  initialState,
  steps: [
    { id: "story", title: "Airport checkpoints", Component: Airport },
    { id: "pipeline", title: "Put the pipeline in order", Component: Pipeline },
    { id: "onion", title: "In through the layers, out in reverse", Component: Onion },
    { id: "common", title: "What belongs in middleware", Component: Common },
    {
      id: "check",
      title: "Order the essentials",
      checkpoint: "backend-middleware",
      Component: MwCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
