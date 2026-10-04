"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LateState } from "./state";
import { Postcards, Reload, Clocks, Patterns, SafeToRerun, Wrap } from "./steps";

export default defineModule<LateState>({
  initialState,
  steps: [
    { id: "story", title: "Postcards from holiday", Component: Postcards },
    { id: "reload", title: "A week of late orders", Component: Reload },
    { id: "clocks", title: "Two clocks", Component: Clocks },
    { id: "patterns", title: "Loads you can run twice", Component: Patterns },
    { id: "check", title: "Safe to re-run?", checkpoint: "safe-rerun", Component: SafeToRerun },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
