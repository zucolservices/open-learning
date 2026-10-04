"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LatState } from "./state";
import { Pizza, Budget, Breakdown, Measure, FirstFix, Wrap } from "./steps";

export default defineModule<LatState>({
  initialState,
  steps: [
    { id: "story", title: "Thirty minutes or it's free", Component: Pizza },
    { id: "budget", title: "Build the latency budget", Component: Budget },
    { id: "breakdown", title: "A published breakdown", Component: Breakdown },
    { id: "measure", title: "Measure what callers hear", Component: Measure },
    {
      id: "check",
      title: "What would you fix first?",
      checkpoint: "latency-first",
      Component: FirstFix,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
