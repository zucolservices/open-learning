"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BudgetState } from "./state";
import { BurnRate, FridayLaunch, SpendIt, Wrap } from "./steps";

export default defineModule<BudgetState>({
  initialState,
  steps: [
    { id: "spend", title: "Spend the budget", Component: SpendIt },
    { id: "burn", title: "Burn rate", Component: BurnRate },
    {
      id: "check",
      title: "The Friday launch",
      checkpoint: "friday-launch",
      Component: FridayLaunch,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
