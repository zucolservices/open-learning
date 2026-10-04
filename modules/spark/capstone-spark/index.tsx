"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Brief, Investigate, Precedents, Routine, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "investigate", title: "Find and fix", Component: Investigate },
    { id: "precedents", title: "It happens for real", Component: Precedents },
    {
      id: "routine",
      title: "A diagnosis routine",
      checkpoint: "spark-routine",
      Component: Routine,
    },
    { id: "wrap", title: "The whole track", Component: Wrap },
  ],
});
