"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CostState } from "./state";
import { FindWaste, HowToBuy, PriceIt, ShowIt, Travel, Wrap } from "./steps";

export default defineModule<CostState>({
  initialState,
  steps: [
    { id: "travel", title: "Meter, pass or standby", Component: Travel },
    { id: "price", title: "Price the workload", Component: PriceIt },
    { id: "waste", title: "Find the waste", Component: FindWaste },
    { id: "show", title: "Who spent it?", Component: ShowIt },
    { id: "buy", title: "How would you buy it?", checkpoint: "how-to-buy", Component: HowToBuy },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
