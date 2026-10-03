"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type QpState } from "./state";
import { WhatNotHow, ReadPlan, Costs, ScanTypes, WhatIsCost, Wrap } from "./steps";

export default defineModule<QpState>({
  initialState,
  steps: [
    { id: "what", title: "What, not how", Component: WhatNotHow },
    { id: "read", title: "Read a plan", Component: ReadPlan },
    { id: "costs", title: "Estimates and reality", Component: Costs },
    { id: "scans", title: "Scans and plan caching", Component: ScanTypes },
    {
      id: "check",
      title: "What does the cost mean?",
      checkpoint: "what-is-cost",
      Component: WhatIsCost,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
