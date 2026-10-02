"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CostState } from "./state";
import { PhonePlans, CutTheBill, PricingUnits, BuildOrBuy, SafeOrBlind, Wrap } from "./steps";

export default defineModule<CostState>({
  initialState,
  steps: [
    { id: "plans", title: "Same calls, different bills", Component: PhonePlans },
    { id: "cut", title: "Cut the bill", Component: CutTheBill },
    { id: "units", title: "What you pay for", Component: PricingUnits },
    { id: "build", title: "Build or buy", Component: BuildOrBuy },
    {
      id: "check",
      title: "Saving or going blind?",
      checkpoint: "safe-or-blind",
      Component: SafeOrBlind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
