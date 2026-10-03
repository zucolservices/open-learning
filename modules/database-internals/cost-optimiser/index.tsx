"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CoState } from "./state";
import { OldMap, StaleStats, WhatsCollected, Correlated, FixIt, Wrap } from "./steps";

export default defineModule<CoState>({
  initialState,
  steps: [
    { id: "map", title: "An old map", Component: OldMap },
    { id: "stale", title: "The overnight load", Component: StaleStats },
    { id: "collected", title: "What the planner knows", Component: WhatsCollected },
    { id: "corr", title: "Pune and 411001", Component: Correlated },
    { id: "check", title: "What would you do?", checkpoint: "fix-plan", Component: FixIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
