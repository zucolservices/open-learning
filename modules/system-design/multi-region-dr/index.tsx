"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DrState } from "./state";
import { Drill, FourWays, Landscape, Residency, RpoOrRto, Wrap } from "./steps";

export default defineModule<DrState>({
  initialState,
  steps: [
    { id: "four-ways", title: "Four ways to be ready", Component: FourWays },
    { id: "rpo-rto", title: "RPO or RTO?", checkpoint: "rpo-rto", Component: RpoOrRto },
    { id: "drill", title: "The failover drill", Component: Drill },
    {
      id: "residency",
      title: "Where may the copy live?",
      checkpoint: "residency",
      Component: Residency,
    },
    { id: "landscape", title: "Building blocks", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
