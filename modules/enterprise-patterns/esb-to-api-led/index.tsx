"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EsbState } from "./state";
import { FourEras, TraceChange, ApiLayers, Platforms, WhereLogic, Wrap } from "./steps";

export default defineModule<EsbState>({
  initialState,
  steps: [
    { id: "eras", title: "Four eras of integration", Component: FourEras },
    { id: "trace", title: "Trace one change", Component: TraceChange },
    { id: "layers", title: "API-led layers", Component: ApiLayers },
    { id: "platforms", title: "The platforms today", Component: Platforms },
    {
      id: "check",
      title: "Where should the logic live?",
      checkpoint: "where-logic",
      Component: WhereLogic,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
