"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LeakState } from "./state";
import { CleverHans, FindLeak, Cases, SplitFirst, LeakOrSafe, Wrap } from "./steps";

export default defineModule<LeakState>({
  initialState,
  steps: [
    { id: "story", title: "The horse that could count", Component: CleverHans },
    { id: "find", title: "Find the leak", Component: FindLeak },
    { id: "cases", title: "Leaks in the wild", Component: Cases },
    { id: "split-first", title: "Split first, then prepare", Component: SplitFirst },
    { id: "check", title: "Leak or safe?", checkpoint: "leak-or-safe", Component: LeakOrSafe },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
