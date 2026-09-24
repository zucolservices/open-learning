"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AvailState } from "./state";
import { Correlated, Nines, PredictChain, Slas, WeakLink, Wrap } from "./steps";

export default defineModule<AvailState>({
  initialState,
  steps: [
    { id: "nines", title: "How many nines?", Component: Nines },
    { id: "weak-link", title: "Find the weak link", Component: WeakLink },
    { id: "ten-deps", title: "Ten dependencies", checkpoint: "ten-deps", Component: PredictChain },
    {
      id: "correlated",
      title: "When copies fail together",
      checkpoint: "correlated",
      Component: Correlated,
    },
    { id: "slas", title: "What the cloud promises", Component: Slas },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
