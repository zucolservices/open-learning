"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TypesState } from "./state";
import { PullOrPush, RateFirst, ThreeWays, WhichType, Wrap } from "./steps";

export default defineModule<TypesState>({
  initialState,
  steps: [
    { id: "three", title: "Three ways to count", Component: ThreeWays },
    { id: "rate", title: "Rate first, then sum", Component: RateFirst },
    { id: "pull", title: "Pull or push", Component: PullOrPush },
    { id: "check", title: "Which type?", checkpoint: "which-metric-type", Component: WhichType },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
