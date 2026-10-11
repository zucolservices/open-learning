"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConcState } from "./state";
import { Restaurant, Burst, Languages, Pitfalls, ConcCheck, Wrap } from "./steps";

export default defineModule<ConcState>({
  initialState,
  steps: [
    { id: "story", title: "Three ways to staff a restaurant", Component: Restaurant },
    { id: "burst", title: "Forty requests arrive at once", Component: Burst },
    { id: "languages", title: "How each platform does it", Component: Languages },
    { id: "pitfalls", title: "Concurrency is not parallelism", Component: Pitfalls },
    {
      id: "check",
      title: "Everyone freezes",
      checkpoint: "backend-concurrency",
      Component: ConcCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
