"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ResState } from "./state";
import { BreakerCheck, BreakerStates, Cascade, RateLimit, ShedOrder, Tools, Wrap } from "./steps";

export default defineModule<ResState>({
  initialState,
  steps: [
    { id: "cascade", title: "One slow service", Component: Cascade },
    { id: "breaker", title: "Inside a circuit breaker", Component: BreakerStates },
    {
      id: "breaker-alone",
      title: "Why didn't the breaker trip?",
      checkpoint: "breaker-alone",
      Component: BreakerCheck,
    },
    { id: "rate-limit", title: "Rate limiting", Component: RateLimit },
    { id: "shed", title: "What to drop first", checkpoint: "shed-order", Component: ShedOrder },
    { id: "tools", title: "Where these live", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
