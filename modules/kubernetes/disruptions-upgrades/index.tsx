"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DisState } from "./state";
import { BudgetApplies, DrainNodes, RoadWorks, Upgrading, Wrap } from "./steps";

export default defineModule<DisState>({
  initialState,
  steps: [
    { id: "road", title: "Road works on a busy highway", Component: RoadWorks },
    { id: "drain", title: "Drain the nodes", Component: DrainNodes },
    { id: "upgrade", title: "Upgrading Kubernetes", Component: Upgrading },
    {
      id: "check",
      title: "Does the budget apply?",
      checkpoint: "budget-applies",
      Component: BudgetApplies,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
